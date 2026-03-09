/**
 * utils/AppError.js
 *
 * Custom error class that carries an HTTP status code.
 * Throwing `new AppError(message, statusCode)` in any controller
 * will be caught by the global error handler and formatted consistently.
 */

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // distinguishes expected errors from bugs
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
