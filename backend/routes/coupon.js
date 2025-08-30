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
import { Coupon } from "../models/Coupon.js";

const router = express.Router();

// Test endpoint (no auth required)
router.get("/test", (req, res) => {
  res.json({ 
    success: true, 
    message: "Coupon API is working!",
    timestamp: new Date().toISOString()
  });
});

// Temporary test validation endpoint (no auth required for debugging)
router.post("/test-validate", async (req, res) => {
  try {
    const { code, amount } = req.body;
    
    if (!code || !amount) {
      return res.status(400).json({
        success: false,
        message: "Coupon code and amount are required",
      });
    }

    // Find the coupon
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Invalid coupon code",
      });
    }

    // Check if coupon is valid
    if (!coupon.isValid()) {
      return res.status(400).json({
        success: false,
        message: "Coupon is expired or inactive",
      });
    }

    // Calculate discount
    const discountAmount = coupon.calculateDiscount(amount);
    const finalAmount = amount - discountAmount;

    if (discountAmount === 0) {
      return res.status(400).json({
        success: false,
        message: `Minimum purchase amount of ₹${coupon.minimumAmount} required for this coupon`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Coupon applied successfully (TEST MODE)",
      data: {
        coupon: {
          id: coupon._id,
          code: coupon.code,
          description: coupon.description,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          minimumAmount: coupon.minimumAmount,
          maximumDiscount: coupon.maximumDiscount,
        },
        originalAmount: amount,
        discountAmount: discountAmount,
        finalAmount: finalAmount,
      },
    });
  } catch (error) {
    console.error('Test coupon validation error:', error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
});

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
