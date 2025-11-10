// backend/routes/checkoutRoutes.js
// Checkout endpoints for order creation and payment confirmation.

import { Router } from 'express';
import {
  createOrderAndPaymentIntent,
  confirmPaymentController
} from '../controllers/checkoutController.js';

const router = Router();

router.post('/create-order', createOrderAndPaymentIntent);
router.post('/confirm', confirmPaymentController);

export default router;

