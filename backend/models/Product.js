// backend/models/Product.js
// Defines the Product schema used for catalog items in MongoDB.

import mongoose from 'mongoose';

const { Schema } = mongoose;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 180
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    description: {
      type: String,
      required: true
    },
    shortDescription: {
      type: String,
      maxlength: 280
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: 'USD'
    },
    imageUrl: {
      type: String
    },
    images: [
      {
        type: String
      }
    ],
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category'
    },
    tags: [
      {
        type: String
      }
    ],
    specs: [
      {
        key: { type: String },
        value: { type: String }
      }
    ],
    stock: {
      type: Number,
      default: 0,
      min: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform(doc, ret) {
        delete ret.__v;
        return ret;
      }
    },
    toObject: {
      virtuals: true
    }
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;

