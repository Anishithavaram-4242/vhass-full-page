import express from "express";
import {
  validateCoupon,
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  getCouponStats,
  applyCouponToTransaction,
} from "../controllers/coupon.js";
import { isAuth } from "../middlewares/isAuth.js";
import { isAdmin } from "../middlewares/isAuth.js";

const router = express.Router();

// User routes
router.post("/validate", isAuth, validateCoupon);
router.post("/apply", isAuth, applyCouponToTransaction);

// Admin routes
router.post("/create", isAuth, isAdmin, createCoupon);
router.get("/all", isAuth, isAdmin, getAllCoupons);
router.get("/:id", isAuth, isAdmin, getCouponById);
router.put("/:id", isAuth, isAdmin, updateCoupon);
router.delete("/:id", isAuth, isAdmin, deleteCoupon);
router.get("/:id/stats", isAuth, isAdmin, getCouponStats);

export default router;
