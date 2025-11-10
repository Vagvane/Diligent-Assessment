// backend/models/Order.js
// Captures checkout orders and payment state.

import mongoose from 'mongoose';

const { Schema } = mongoose;

const orderItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    image: { type: String }
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    items: {
      type: [orderItemSchema],
      validate: [(val) => val.length > 0, 'Order must include at least one item.']
    },
    subtotal: { type: Number, required: true, min: 0 },
    tax: { type: Number, required: true, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'USD' },
    status: {
      type: String,
      enum: ['PENDING', 'PAID', 'FAILED'],
      default: 'PENDING'
    },
    paymentProvider: { type: String, default: 'mock' },
    paymentIntentId: { type: String },
    customerEmail: { type: String, trim: true },
    customer: {
      name: { type: String, trim: true },
      email: { type: String, trim: true },
      address: { type: String, trim: true }
    }
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;

