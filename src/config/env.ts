import 'dotenv/config';

export const env = {
  paypal: {
    clientId: process.env.PAYPAL_CLIENT_ID!,
    secret: process.env.PAYPAL_SECRET!,
  },
};
