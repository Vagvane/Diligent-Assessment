// backend/routes/orderRoutes.js
// Read-only order routes used by the frontend confirmation page.

import { Router } from 'express';
import { getOrderById } from '../controllers/orderController.js';

const router = Router();

router.get('/:id', getOrderById);

export default router;

