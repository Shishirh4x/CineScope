import jwt from 'jsonwebtoken';

/**
 * Generate a JWT for the given user ID.
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * Generate a JWT and send it in the JSON response.
 *
 * @param {object}  res        - Express response object
 * @param {string}  userId     - MongoDB user _id
 * @param {number}  statusCode - HTTP status code
 * @param {object}  [extra={}] - Additional fields to merge into the response body
 */
export const sendTokenResponse = (res, userId, statusCode, extra = {}) => {
  const token = generateToken(userId);

  res.status(statusCode).json({
    success: true,
    token,
    ...extra,
  });
};

export default generateToken;
