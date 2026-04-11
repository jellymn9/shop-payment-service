import "dotenv/config";

export const env = {
  paypal: {
    clientId: process.env.PAYPAL_CLIENT_ID!,
    secret: process.env.PAYPAL_SECRET!,
    baseUrl:
      process.env.PAYPAL_ENV === "production"
        ? "https://api-m.paypal.com"
        : "https://api-m.sandbox.paypal.com",
  },
};
