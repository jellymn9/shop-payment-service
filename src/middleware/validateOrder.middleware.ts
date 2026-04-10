import { Request, Response, NextFunction } from 'express';
import { OrderItem } from '../models/order.model';

export const validateOrder = (req: Request, res: Response, next: NextFunction): void => {
  const items: OrderItem[] = req.body.items;

  if (!items || items.length === 0) {
    res.status(400).json({ error: 'Cart is empty' });
    return;
  }

  for (const item of items) {
    if (!item.productId || !item.name) {
      res.status(400).json({ error: 'Each item must have a productId and name' });
      return;
    }
    if (item.price <= 0) {
      res.status(400).json({ error: `Invalid price for item: ${item.name}` });
      return;
    }
    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      res.status(400).json({ error: `Invalid quantity for item: ${item.name}` });
      return;
    }
  }

  next();
};
