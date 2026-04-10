import { Request, Response, NextFunction } from 'express';
import { placeOrder } from '../services/order.service';
import { CreateOrderDto } from '../models/order.model';

export const createOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const dto: CreateOrderDto = { items: req.body.items };
    const order = await placeOrder(dto);
    res.status(201).json({ orderId: order.id });
  } catch (err) {
    next(err);
  }
};
