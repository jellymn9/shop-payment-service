import { Router } from 'express';
import { validateOrder } from '../middleware/validateOrder.middleware';
import { createOrder } from '../controllers/order.controller';

const router = Router();

router.post('/', validateOrder, createOrder);

export default router;
