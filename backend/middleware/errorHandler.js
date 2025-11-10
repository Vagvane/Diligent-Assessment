// backend/middleware/errorHandler.js
// Provides basic 404 handler and centralized error response for Express.

export function notFound(req, res, next) {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404;
  next(error);
}

export function errorHandler(err, req, res, next) {
  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    // Include stack only in non-production environments.
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
}

