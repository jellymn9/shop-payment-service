import { Request, Response, NextFunction } from "express";
import {
  createPayPalOrder as createPayPalOrderService,
  capturePayment as capturePaymentService,
  verifyWebhookSignature,
} from "../services/paypal.service";
import {
  fetchOrder,
  markOrderPaid,
  markOrderFailed,
  linkPayPalOrder,
} from "../services/order.service";

export const createPayPalOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { orderId } = req.body as { orderId: string };
    const order = await fetchOrder(orderId);
    const paypalOrderId = await createPayPalOrderService(order.id, order.totalAmount);
    await linkPayPalOrder(order.id, paypalOrderId);
    res.status(201).json({ paypalOrderId });
  } catch (err) {
    next(err);
  }
};

export const capturePayment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { orderId, paypalOrderId } = req.body as {
      orderId: string;
      paypalOrderId: string;
    };
    try {
      await capturePaymentService(paypalOrderId);
      await markOrderPaid(orderId, paypalOrderId);
      res.status(200).json({ status: "paid" });
    } catch {
      await markOrderFailed(orderId);
      res.status(200).json({ status: "failed" });
    }
  } catch (err) {
    next(err);
  }
};

export const handleWebhook = async (
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> => {
  res.sendStatus(200);

  try {
    const rawBody = req.body as Buffer;
    const isValid = await verifyWebhookSignature(req.headers, rawBody);

    if (!isValid) {
      console.error("PayPal webhook signature verification failed");
      return;
    }

    const event = JSON.parse(rawBody.toString("utf8")) as {
      event_type: string;
      resource: {
        id: string;
        custom_id: string;
        supplementary_data?: {
          related_ids?: {
            order_id?: string;
          };
        };
      };
    };

    const orderId = event.resource.custom_id;
    const paypalOrderId =
      event.resource.supplementary_data?.related_ids?.order_id ?? event.resource.id;

    if (event.event_type === "PAYMENT.CAPTURE.COMPLETED") {
      await markOrderPaid(orderId, paypalOrderId);
    } else if (event.event_type === "PAYMENT.CAPTURE.DENIED") {
      await markOrderFailed(orderId);
    }
  } catch (err) {
    console.error("PayPal webhook processing error:", err);
  }
};
