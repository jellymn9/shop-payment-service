import { env } from "../config/env";

interface PayPalTokenResponse {
  access_token: string;
}

interface PayPalOrderResponse {
  id: string;
  status: string;
}

const getAccessToken = async (): Promise<string> => {
  const credentials = Buffer.from(
    `${env.paypal.clientId}:${env.paypal.secret}`
  ).toString("base64");

  const response = await fetch(`${env.paypal.baseUrl}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    throw new Error(`PayPal auth failed: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as PayPalTokenResponse;
  return data.access_token;
};

export const createPayPalOrder = async (
  orderId: string,
  amount: number
): Promise<string> => {
  const accessToken = await getAccessToken();

  const response = await fetch(`${env.paypal.baseUrl}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          custom_id: orderId,
          amount: {
            currency_code: "EUR",
            value: amount.toFixed(2),
          },
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`PayPal create order failed: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as PayPalOrderResponse;
  return data.id;
};

export const capturePayment = async (paypalOrderId: string): Promise<void> => {
  const accessToken = await getAccessToken();

  const response = await fetch(
    `${env.paypal.baseUrl}/v2/checkout/orders/${paypalOrderId}/capture`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    }
  );

  if (!response.ok) {
    throw new Error(`PayPal capture failed: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as PayPalOrderResponse;

  if (data.status !== "COMPLETED") {
    throw new Error(`PayPal capture did not complete. Status: ${data.status}`);
  }
};
