import { FieldValue } from "firebase-admin/firestore";
import { db } from "../config/firebase";
import { Order, OrderStatus } from "../models/order.model";

const collection = db.collection("orders");

export const createOrder = async (
  data: Omit<Order, "id" | "createdAt">,
): Promise<Order> => {
  const ref = collection.doc();
  const order: Order = {
    ...data,
    id: ref.id,
    createdAt: FieldValue.serverTimestamp() as any,
  };
  await ref.set(order);
  return order; // check this out later
};

export const getOrderById = async (id: string): Promise<Order | null> => {
  const snap = await collection.doc(id).get();
  if (!snap.exists) return null;
  return snap.data() as Order;
};

export const updateOrder = async (
  id: string,
  data: Partial<Omit<Order, "id" | "createdAt">>,
): Promise<void> => {
  await collection.doc(id).update(data);
};
