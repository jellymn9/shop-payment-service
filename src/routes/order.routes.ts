import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { validateOrder } from '../middleware/validateOrder.middleware';
import { createOrder } from '../controllers/order.controller';

const router = Router();

router.post('/', authenticate, validateOrder, createOrder);

export default router;
