import express from "express";
import {
  getAllCourses,
  getSingleCourse,
  fetchLectures,
  fetchLecture,
  getMyCourses,
  phonepeCheckout,
  phonepeStatus,
  createCourse
} from "../controllers/course.js";
import { isAuth, isAdmin } from "../middlewares/isAuth.js";
import { deleteCourse, addLectures } from "../controllers/admin.js";
import { uploadFiles } from "../middlewares/multer.js";
import { Coupon } from "../models/Coupon.js";

const router = express.Router();

router.get("/course/all", getAllCourses);

// Update lecture route to use uploadFiles middleware
router.post("/course/new", isAuth, isAdmin, createCourse);
router.post("/course/:id", isAuth, isAdmin, uploadFiles.fields([{ name: 'file', maxCount: 1 }]), addLectures);
router.delete("/course/:id", isAuth, isAdmin, deleteCourse);
router.get("/course/:id", getSingleCourse);
router.get("/lectures/:id", isAuth, fetchLectures);
router.get("/lecture/:id", isAuth, fetchLecture);
router.get("/mycourse", isAuth, getMyCourses);

// PhonePe payment endpoints
router.post("/course/phonepe/checkout/:id", isAuth, phonepeCheckout);
router.post("/course/phonepe/status/:merchantOrderId", isAuth, phonepeStatus);

// Temporary coupon validation endpoint (workaround until coupon routes are deployed)
router.post("/course/validate-coupon", async (req, res) => {
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
      message: "Coupon applied successfully",
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
    console.error('Coupon validation error:', error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
});

export default router;
