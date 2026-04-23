import { Router } from "express";
import express from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  createPayPalOrder,
  capturePayment,
  handleWebhook,
} from "../controllers/paypal.controller";

const router = Router();

router.post("/create-order", express.json(), authenticate, createPayPalOrder);
router.post("/capture", express.json(), authenticate, capturePayment);
router.post("/webhook", express.raw({ type: "application/json" }), handleWebhook);

export default router;
