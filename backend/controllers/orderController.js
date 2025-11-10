// backend/controllers/orderController.js
// Provides read-only order endpoints.

import mongoose from 'mongoose';
import Order from '../models/Order.js';

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

export async function getOrderById(req, res, next) {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      res.status(400);
      throw new Error('Invalid order id.');
    }

    const order = await Order.findById(id).lean();
    if (!order) {
      res.status(404);
      throw new Error('Order not found.');
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
}

