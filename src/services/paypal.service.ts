import { env } from "../config/env";

interface PayPalTokenResponse {
  access_token: string;
}

interface PayPalOrderResponse {
  id: string;
  status: string;
}

interface WebhookVerificationResponse {
  verification_status: "SUCCESS" | "FAILURE";
}

const getAccessToken = async (): Promise<string> => {
  const credentials = Buffer.from(
    `${env.paypal.clientId}:${env.paypal.secret}`,
  ).toString("base64");

  const response = await fetch(`${env.paypal.baseUrl}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    throw new Error(
      `PayPal auth failed: ${response.status} ${response.statusText}`,
    );
  }

  const data = (await response.json()) as PayPalTokenResponse;
  return data.access_token;
};

export const createPayPalOrder = async (
  orderId: string,
  amount: number,
): Promise<string> => {
  const accessToken = await getAccessToken();

  const response = await fetch(`${env.paypal.baseUrl}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          custom_id: orderId,
          amount: {
            currency_code: "USD",
            value: amount.toFixed(2),
          },
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(
      `PayPal create order failed: ${response.status} ${response.statusText}`,
    );
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
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    },
  );

  if (!response.ok) {
    throw new Error(
      `PayPal capture failed: ${response.status} ${response.statusText}`,
    );
  }

  const data = (await response.json()) as PayPalOrderResponse;

  if (data.status !== "COMPLETED") {
    throw new Error(`PayPal capture did not complete. Status: ${data.status}`);
  }
};

export const verifyWebhookSignature = async (
  headers: Record<string, string | string[] | undefined>,
  rawBody: Buffer,
): Promise<boolean> => {
  const accessToken = await getAccessToken();

  const response = await fetch(
    `${env.paypal.baseUrl}/v1/notifications/verify-webhook-signature`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transmission_id: headers["paypal-transmission-id"],
        transmission_time: headers["paypal-transmission-time"],
        cert_url: headers["paypal-cert-url"],
        auth_algo: headers["paypal-auth-algo"],
        transmission_sig: headers["paypal-transmission-sig"],
        webhook_id: env.paypal.webhookId,
        webhook_event: JSON.parse(rawBody.toString("utf8")),
      }),
    },
  );

  if (!response.ok) {
    throw new Error(
      `PayPal webhook verification failed: ${response.status} ${response.statusText}`,
    );
  }

  const data = (await response.json()) as WebhookVerificationResponse;
  return data.verification_status === "SUCCESS";
};
