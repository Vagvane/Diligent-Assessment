// backend/controllers/checkoutController.js
// Handles checkout lifecycle: order creation and payment confirmation.

import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { createPaymentIntent, confirmPayment } from '../services/paymentService.js';

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

function calculateTax(subtotal) {
  const taxRate = Number(process.env.TAX_RATE || 0);
  return Number((subtotal * taxRate).toFixed(2));
}

export async function createOrderAndPaymentIntent(req, res, next) {
  try {
    const { items, customer = {} } = req.body || {};

    if (!Array.isArray(items) || items.length === 0) {
      res.status(400);
      throw new Error('Cart cannot be empty.');
    }

    // Fetch product data and validate quantities.
    const orderItems = [];
    let subtotal = 0;
    for (const item of items) {
      const { productId, quantity } = item || {};
      if (!productId || !isValidObjectId(productId)) {
        res.status(400);
        throw new Error('Invalid product identifier.');
      }
      const qty = Number(quantity) || 0;
      if (qty <= 0) {
        res.status(400);
        throw new Error('Quantity must be greater than zero.');
      }

      const product = await Product.findById(productId).lean();
      if (!product || !product.isActive) {
        res.status(404);
        throw new Error('One of the products is unavailable.');
      }

      const price = Number(product.price);
      subtotal += price * qty;

      orderItems.push({
        productId: product._id,
        name: product.name,
        price,
        quantity: qty,
        image: product.images?.[0] || product.imageUrl
      });
    }

    subtotal = Number(subtotal.toFixed(2));
    const tax = calculateTax(subtotal);
    const totalAmount = Number((subtotal + tax).toFixed(2));
    const currency = 'USD';

    // Create order with pending status.
    const order = await Order.create({
      items: orderItems,
      subtotal,
      tax,
      totalAmount,
      currency,
      status: 'PENDING',
      paymentProvider: 'mock',
      customerEmail: customer.email,
      customer: {
        name: customer.name,
        email: customer.email,
        address: customer.address
      }
    });

    const paymentIntent = await createPaymentIntent({
      amount: totalAmount,
      currency,
      metadata: { orderId: String(order._id) }
    });

    order.paymentIntentId = paymentIntent.id;
    order.paymentProvider = paymentIntent.provider;
    await order.save();

    res.status(201).json({
      orderId: order._id,
      clientSecret: paymentIntent.clientSecret,
      totalAmount,
      currency
    });
  } catch (error) {
    next(error);
  }
}

export async function confirmPaymentController(req, res, next) {
  try {
    const { orderId, paymentStatus, paymentPayload = {} } = req.body || {};

    if (!orderId || !isValidObjectId(orderId)) {
      res.status(400);
      throw new Error('Valid orderId is required.');
    }

    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404);
      throw new Error('Order not found.');
    }

    if (!order.paymentIntentId) {
      res.status(400);
      throw new Error('Order is missing payment intent.');
    }

    const confirmation = await confirmPayment(order.paymentIntentId, {
      status: paymentStatus,
      ...paymentPayload
    });

    order.status = confirmation.success ? 'PAID' : 'FAILED';
    await order.save();

    res.json(order);
  } catch (error) {
    next(error);
  }
}

