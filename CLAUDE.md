# CLAUDE.md

## 📌 Project Overview

This is a backend service for an e-commerce application that handles:

- Order creation and management
- PayPal payment integration
- Firestore as the primary database

The backend is built using **Node.js + Express** and follows a layered architecture (controllers → services → repositories).

---

## 🏗️ Architecture

```
/src
  /controllers     → Handle HTTP requests/responses
  /services        → Business logic
  /repositories    → Firestore access layer
  /routes          → API routes
  /config          → External services (Firebase, PayPal)
  /utils           → Helpers and shared logic
```

---

## 🧠 Core Concepts

### 1. Order Lifecycle

Orders follow a strict lifecycle:

```
pending → paid
        → failed
```

#### Status meanings:

- `pending` → Order created, payment not completed
- `paid` → Payment successfully captured
- `failed` → Payment failed or canceled

---

### 2. Payment Flow (PayPal)

The system uses PayPal as an external payment provider.

#### Flow:

1. Create order in database (`pending`)
2. Create PayPal order (via backend)
3. User approves payment (frontend)
4. Capture payment (backend)
5. Update order status (`paid` or `failed`)

---

## 📦 Firestore Structure

### Collection: `orders`

Example document:

```json
{
  "id": "order_123",
  "items": [
    {
      "productId": "prod_1",
      "name": "Product Name",
      "price": 20.0,
      "quantity": 2
    }
  ],
  "totalAmount": 40.0,
  "status": "pending",
  "userId": "user_id",
  "email": "some@email.com",
  "shippingAddress": {
    "fullName": "name some",
    "street": "Some Street",
    "city": "Belgrade",
    "postalCode": "11000",
    "country": "Serbia"
  },
  "paymentProvider": "paypal",
  "paymentStatus": "created",
  "paypalOrderId": null,
  "createdAt": "timestamp",
  "paidAt": null
}
```

---

## 🔐 Security Rules

### ⚠️ Never trust the frontend

The backend must always:

- Recalculate total price
- Validate cart items
- Ignore any client-provided totals

---

### 🔑 Environment Variables

Required:

```
PAYPAL_CLIENT_ID=
PAYPAL_SECRET=
FIREBASE_PROJECT_ID=
```

---

## 🔁 API Endpoints

### Orders

#### `POST /orders`

Creates a new order.

- Validates cart
- Calculates total
- Stores order in Firestore

---

### PayPal

#### `POST /paypal/create-order`

- Creates PayPal order
- Uses amount from database
- Stores `paypalOrderId`

#### `POST /paypal/capture`

- Captures PayPal payment
- Updates order status

---

## 🧩 Design Principles

- Thin controllers, fat services
- Repository pattern for database access
- No business logic in routes
- Backend is source of truth

---

## 🚀 Future Improvements

- Add PayPal webhooks (for reliability)
- Add user authentication
- Support multiple payment providers (Stripe)
- Add order history per user
- Implement retry/idempotency logic

---

## ⚙️ Development Notes

- Firestore collections are created automatically when documents are added
- Use `serverTimestamp()` instead of `new Date()`
- Always log payment responses for debugging

---

## 🧪 Testing Strategy (optional)

- Unit test services
- Mock PayPal API
- Validate order state transitions

---

## 📣 Summary

This backend is designed to mimic real-world e-commerce systems:

- Secure payment handling
- Clear separation of concerns
- Scalable architecture

The backend is the **source of truth**, while PayPal is used strictly as a payment processor.

---
