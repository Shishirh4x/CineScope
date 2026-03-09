/**
 * @file controllers/auth.controller.js
 * @description Authentication controller — register, login, profile, logout.
 */

import User          from "../models/user.model.js";
import AppError      from "../utils/AppError.js";
import asyncHandler  from "../middleware/asyncHandler.js";
import { sendTokenResponse } from "../utils/generateToken.js";

// ─────────────────────────────────────────────
//  REGISTER
// ─────────────────────────────────────────────
export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return next(new AppError("An account with this email already exists.", 409));

  const user = await User.create({ name, email, password });
  sendTokenResponse(res, user._id, 201, {
    user: { _id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

// ─────────────────────────────────────────────
//  LOGIN
// ─────────────────────────────────────────────
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password)))
    return next(new AppError("Invalid email or password.", 401));

  if (user.isBanned)
    return next(new AppError("Your account has been suspended. Contact support.", 403));

  sendTokenResponse(res, user._id, 200, {
    user: { _id: user._id, name: user.name, email: user.email, role: user.role, isAdmin: user.role === "admin" },
  });
});

// ─────────────────────────────────────────────
//  PROFILE
// ─────────────────────────────────────────────
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({ success: true, user });
});

export const updateMe = asyncHandler(async (req, res, next) => {
  if (req.body.password || req.body.role)
    return next(new AppError("This route does not support password or role updates.", 400));

  const updates = {};
  ["name", "avatar"].forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
  res.status(200).json({ success: true, user });
});

// ─────────────────────────────────────────────
//  LOGOUT
// ─────────────────────────────────────────────
export const logout = asyncHandler(async (req, res) => {
  res
    .cookie("token", "loggedout", { expires: new Date(Date.now() + 5000), httpOnly: true })
    .status(200)
    .json({ success: true, message: "Logged out successfully." });
});
