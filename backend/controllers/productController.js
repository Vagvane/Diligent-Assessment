// backend/controllers/productController.js
// Contains route handlers for managing products.

import mongoose from 'mongoose';
import Product from '../models/Product.js';

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

export async function getProducts(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 12));
    const skip = (page - 1) * limit;
    const search = req.query.search?.trim();
    const category = req.query.category?.trim();

    const filters = { isActive: true };
    if (search) {
      filters.$text = { $search: search };
    }
    if (category) {
      if (isValidObjectId(category)) {
        filters.category = category;
      } else {
        // fallback: match slug from populated category; requires join
        const matched = await Product.find({}).populate('category', 'slug').select('_id category').lean();
        const matchingIds = matched
          .filter((p) => p.category?.slug === category)
          .map((p) => p._id);
        filters._id = { $in: matchingIds };
      }
    }

    const [items, totalItems] = await Promise.all([
      Product.find(filters)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('name slug price currency imageUrl images shortDescription stock')
        .lean(),
      Product.countDocuments(filters)
    ]);

    res.json({
      items,
      page,
      pageSize: limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit)
    });
  } catch (error) {
    next(error);
  }
}

export async function getProductById(req, res, next) {
  try {
    const { id } = req.params;
    const query = isValidObjectId(id) ? { _id: id } : { slug: id };

    const product = await Product.findOne(query).populate('category', 'name slug').lean();
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
}

export async function createProduct(req, res, next) {
  try {
    const payload = req.body;
    const exists = await Product.findOne({ slug: payload.slug });
    if (exists) {
      res.status(409);
      throw new Error('Product with this slug already exists');
    }

    const product = await Product.create(payload);
    res.status(201).json({ message: 'Product created', product });
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const { id } = req.params;
    const query = isValidObjectId(id) ? { _id: id } : { slug: id };

    const product = await Product.findOneAndUpdate(query, req.body, {
      new: true,
      runValidators: true
    });
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    res.json({ message: 'Product updated', product });
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;
    const query = isValidObjectId(id) ? { _id: id } : { slug: id };

    const product = await Product.findOneAndDelete(query);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    res.json({ message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
}

