import { OrderItem } from '../models/order.model';

export const calculateTotal = (items: OrderItem[]): number => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return Math.round(total * 100) / 100;
};
