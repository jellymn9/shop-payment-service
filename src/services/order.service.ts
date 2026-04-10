import { FieldValue } from 'firebase-admin/firestore';
import { createOrder, getOrderById, updateOrder } from '../repositories/order.repository';
import { Order, CreateOrderDto } from '../models/order.model';
import { calculateTotal } from '../utils/price.utils';

export const placeOrder = async (dto: CreateOrderDto): Promise<Order> => {
  const totalAmount = calculateTotal(dto.items);

  return createOrder({
    items: dto.items,
    totalAmount,
    status: 'pending',
    paypalOrderId: null,
    paidAt: null,
  });
};

export const fetchOrder = async (id: string): Promise<Order> => {
  const order = await getOrderById(id);
  if (!order) throw new Error(`Order not found: ${id}`);
  return order;
};

export const markOrderPaid = async (id: string, paypalOrderId: string): Promise<void> => {
  await updateOrder(id, {
    status: 'paid',
    paypalOrderId,
    paidAt: FieldValue.serverTimestamp() as any,
  });
};

export const markOrderFailed = async (id: string): Promise<void> => {
  await updateOrder(id, { status: 'failed' });
};
