import { Timestamp } from 'firebase-admin/firestore';

export type OrderStatus = 'pending' | 'paid' | 'failed';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface OrderAddress {
  fullName: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface Order {
  id: string;
  userId: string;
  email: string;
  items: OrderItem[];
  address: OrderAddress;
  totalAmount: number;
  status: OrderStatus;
  paypalOrderId: string | null;
  createdAt: Timestamp;
  paidAt: Timestamp | null;
}

export type CreateOrderDto = Pick<Order, 'items' | 'address'>;
