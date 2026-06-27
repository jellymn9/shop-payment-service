import { createPayPalOrder, capturePayment } from "../services/paypal.service";

const mockFetch = jest.fn();
global.fetch = mockFetch;

const tokenResponse = { access_token: "test-token" };

const mockToken = () =>
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: async () => tokenResponse,
  });

describe("createPayPalOrder", () => {
  beforeEach(() => mockFetch.mockReset());

  it("returns the PayPal order ID on success", async () => {
    mockToken();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: "PAYPAL-123", status: "CREATED" }),
    });

    const id = await createPayPalOrder("order-1", 39.99);

    expect(id).toBe("PAYPAL-123");
  });

  it("sends correct amount formatted to 2 decimal places", async () => {
    mockToken();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: "PAYPAL-123", status: "CREATED" }),
    });

    await createPayPalOrder("order-1", 39.9);

    const body = JSON.parse(mockFetch.mock.calls[1][1].body);
    expect(body.purchase_units[0].amount.value).toBe("39.90");
    expect(body.purchase_units[0].amount.currency_code).toBe("USD");
  });

  it("embeds the internal orderId as custom_id", async () => {
    mockToken();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: "PAYPAL-123", status: "CREATED" }),
    });

    await createPayPalOrder("order-abc", 10);

    const body = JSON.parse(mockFetch.mock.calls[1][1].body);
    expect(body.purchase_units[0].custom_id).toBe("order-abc");
  });

  it("throws when PayPal returns a non-ok response", async () => {
    mockToken();
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
    });

    await expect(createPayPalOrder("order-1", 10)).rejects.toThrow(
      "PayPal create order failed: 401 Unauthorized",
    );
  });
});

describe("capturePayment", () => {
  beforeEach(() => mockFetch.mockReset());

  it("resolves when capture status is COMPLETED", async () => {
    mockToken();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: "PAYPAL-123", status: "COMPLETED" }),
    });

    await expect(capturePayment("PAYPAL-123")).resolves.toBeUndefined();
  });

  it("throws when capture status is not COMPLETED", async () => {
    mockToken();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: "PAYPAL-123", status: "VOIDED" }),
    });

    await expect(capturePayment("PAYPAL-123")).rejects.toThrow(
      "PayPal capture did not complete. Status: VOIDED",
    );
  });

  it("throws when PayPal returns a non-ok response", async () => {
    mockToken();
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 422,
      statusText: "Unprocessable Entity",
    });

    await expect(capturePayment("PAYPAL-123")).rejects.toThrow(
      "PayPal capture failed: 422 Unprocessable Entity",
    );
  });
});
