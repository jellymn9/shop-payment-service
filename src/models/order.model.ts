import { Timestamp } from 'firebase-admin/firestore';

export type OrderStatus = 'pending' | 'paid' | 'failed';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paypalOrderId: string | null;
  createdAt: Timestamp;
  paidAt: Timestamp | null;
}

export type CreateOrderDto = Pick<Order, 'items'>;
