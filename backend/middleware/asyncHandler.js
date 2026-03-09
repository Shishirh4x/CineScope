/**
 * middleware/asyncHandler.js
 *
 * Wraps an async route handler so that any rejected promise
 * is automatically forwarded to Express's next(error).
 * Eliminates repetitive try/catch blocks in controllers.
 *
 * Usage:
 *   import asyncHandler from '../middleware/asyncHandler.js';
 *   export const myHandler = asyncHandler(async (req, res, next) => { ... });
 */

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export default asyncHandler;
