// backend/config/db.js
// Establishes a reusable connection to MongoDB Atlas using Mongoose.

import mongoose from 'mongoose';

/**
 * Connect to MongoDB. Should be invoked once on server startup.
 * @param {string} uri - MongoDB connection string (e.g. mongodb+srv://...).
 */
export async function connectDB(uri) {
  if (!uri) {
    throw new Error('Missing MongoDB connection string.');
  }

  try {
    await mongoose.connect(uri, {
      // dbName can also be encoded inside the URI; include here for clarity.
      dbName: process.env.MONGODB_DB || 'shopsphere',
      serverSelectionTimeoutMS: 5000
    });
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    throw error;
  }
}

// Optional: expose the raw mongoose connection for graceful shutdown hooks.
export function getConnection() {
  return mongoose.connection;
}

