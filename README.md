# Payment Service — Bine Beauty

Backend REST API for order management and PayPal payment processing.

## Tech Stack

- Node.js + TypeScript
- Express 5
- Firebase Admin (Firestore + Auth)
- PayPal REST API
- dotenv

## Project Structure

```
src/
  app.ts              — Express app and global middleware
  server.ts           — Entry point
  config/
    env.ts            — Environment variable config
    firebase.ts       — Firebase Admin initialization
  routes/             — API route definitions
  controllers/        — HTTP request handlers
  services/           — Business logic
  repositories/       — Firestore access layer
  middleware/         — Auth, validation, error handling
  utils/              — Shared helpers
```

## Getting Started

### Prerequisites

- Node.js 18+
- Yarn
- Firebase project with Firestore enabled
- PayPal developer account

### Install

```bash
yarn install
```

### Environment Variables

Copy `.env` and fill in the values:

```bash
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_SECRET=your_paypal_secret
FIREBASE_PROJECT_ID=your_firebase_project_id
```

Firebase credentials are loaded via the `GOOGLE_APPLICATION_CREDENTIALS` environment variable (path to service account JSON) or Application Default Credentials.

### Run

```bash
yarn dev       # development (watch mode)
yarn build     # compile TypeScript
yarn start     # run compiled output
```

## API

### Orders

| Method | Path | Description |
|--------|------|-------------|
| POST | `/orders` | Create a new order |

### PayPal

| Method | Path | Description |
|--------|------|-------------|
| POST | `/paypal/create-order` | Create a PayPal order |
| POST | `/paypal/capture` | Capture a PayPal payment |

## Order Lifecycle

```
pending → paid
        → failed
```

## Architecture

Follows a layered pattern — controllers handle HTTP only, services contain business logic, repositories handle all Firestore access. The backend is the source of truth: total price is always recalculated server-side, never trusted from the client.
