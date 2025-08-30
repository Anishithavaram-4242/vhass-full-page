import { TryCatch } from "../middlewares/TryCatch.js";
import { Coupon } from "../models/Coupon.js";
import { CouponUsage } from "../models/CouponUsage.js";
import { User } from "../models/User.js";
import { Courses } from "../models/Courses.js";
import { Workshop } from "../models/Workshop.js";

// Validate and apply coupon
export const validateCoupon = TryCatch(async (req, res) => {
  const { code, courseId, workshopId, amount } = req.body;
  const userId = req.user._id;

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

  // Check if user has already used this coupon
  const existingUsage = await CouponUsage.findOne({
    userId,
    couponId: coupon._id,
  });

  if (existingUsage) {
    return res.status(400).json({
      success: false,
      message: "You have already used this coupon",
    });
  }

  // Check if coupon applies to the specific course/workshop
  if (!coupon.isGlobal) {
    if (courseId && coupon.applicableCourses.length > 0) {
      if (!coupon.applicableCourses.includes(courseId)) {
        return res.status(400).json({
          success: false,
          message: "This coupon is not applicable to this course",
        });
      }
    }
    
    if (workshopId && coupon.applicableWorkshops.length > 0) {
      if (!coupon.applicableWorkshops.includes(workshopId)) {
        return res.status(400).json({
          success: false,
          message: "This coupon is not applicable to this workshop",
        });
      }
    }
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
});

// Create new coupon (Admin only)
export const createCoupon = TryCatch(async (req, res) => {
  const {
    code,
    description,
    discountType,
    discountValue,
    minimumAmount,
    maximumDiscount,
    validFrom,
    validUntil,
    usageLimit,
    applicableCourses,
    applicableWorkshops,
    isGlobal,
  } = req.body;

  // Check if coupon code already exists
  const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
  if (existingCoupon) {
    return res.status(400).json({
      success: false,
      message: "Coupon code already exists",
    });
  }

  const coupon = await Coupon.create({
    code: code.toUpperCase(),
    description,
    discountType,
    discountValue,
    minimumAmount: minimumAmount || 0,
    maximumDiscount,
    validFrom: new Date(validFrom),
    validUntil: new Date(validUntil),
    usageLimit,
    applicableCourses,
    applicableWorkshops,
    isGlobal: isGlobal !== undefined ? isGlobal : true,
    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Coupon created successfully",
    data: coupon,
  });
});

// Get all coupons (Admin only)
export const getAllCoupons = TryCatch(async (req, res) => {
  const coupons = await Coupon.find()
    .populate("createdBy", "name email")
    .populate("applicableCourses", "title")
    .populate("applicableWorkshops", "title")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: coupons,
  });
});

// Get coupon by ID
export const getCouponById = TryCatch(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id)
    .populate("createdBy", "name email")
    .populate("applicableCourses", "title")
    .populate("applicableWorkshops", "title");

  if (!coupon) {
    return res.status(404).json({
      success: false,
      message: "Coupon not found",
    });
  }

  res.status(200).json({
    success: true,
    data: coupon,
  });
});

// Update coupon (Admin only)
export const updateCoupon = TryCatch(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    return res.status(404).json({
      success: false,
      message: "Coupon not found",
    });
  }

  // Check if code is being updated and if it already exists
  if (req.body.code && req.body.code !== coupon.code) {
    const existingCoupon = await Coupon.findOne({ code: req.body.code.toUpperCase() });
    if (existingCoupon) {
      return res.status(400).json({
        success: false,
        message: "Coupon code already exists",
      });
    }
  }

  const updatedCoupon = await Coupon.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: "Coupon updated successfully",
    data: updatedCoupon,
  });
});

// Delete coupon (Admin only)
export const deleteCoupon = TryCatch(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    return res.status(404).json({
      success: false,
      message: "Coupon not found",
    });
  }

  await Coupon.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Coupon deleted successfully",
  });
});

// Get coupon usage statistics (Admin only)
export const getCouponStats = TryCatch(async (req, res) => {
  const couponId = req.params.id;

  const usageStats = await CouponUsage.aggregate([
    { $match: { couponId: new mongoose.Types.ObjectId(couponId) } },
    {
      $group: {
        _id: null,
        totalUsage: { $sum: 1 },
        totalDiscount: { $sum: "$discountAmount" },
        totalRevenue: { $sum: "$finalAmount" },
      },
    },
  ]);

  const coupon = await Coupon.findById(couponId);
  
  if (!coupon) {
    return res.status(404).json({
      success: false,
      message: "Coupon not found",
    });
  }

  const stats = {
    coupon: {
      id: coupon._id,
      code: coupon.code,
      description: coupon.description,
      usageLimit: coupon.usageLimit,
      usedCount: coupon.usedCount,
    },
    usage: usageStats[0] || {
      totalUsage: 0,
      totalDiscount: 0,
      totalRevenue: 0,
    },
  };

  res.status(200).json({
    success: true,
    data: stats,
  });
});

// Apply coupon to transaction (called during payment)
export const applyCouponToTransaction = TryCatch(async (req, res) => {
  const { couponCode, transactionId, originalAmount } = req.body;
  const userId = req.user._id;

  if (!couponCode || !transactionId || !originalAmount) {
    return res.status(400).json({
      success: false,
      message: "Coupon code, transaction ID, and amount are required",
    });
  }

  // Validate coupon (reuse the validation logic)
  const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
  
  if (!coupon || !coupon.isValid()) {
    return res.status(400).json({
      success: false,
      message: "Invalid or expired coupon",
    });
  }

  // Check if user has already used this coupon
  const existingUsage = await CouponUsage.findOne({
    userId,
    couponId: coupon._id,
  });

  if (existingUsage) {
    return res.status(400).json({
      success: false,
      message: "You have already used this coupon",
    });
  }

  // Calculate discount
  const discountAmount = coupon.calculateDiscount(originalAmount);
  const finalAmount = originalAmount - discountAmount;

  // Create coupon usage record
  await CouponUsage.create({
    userId,
    couponId: coupon._id,
    transactionId,
    originalAmount,
    discountAmount,
    finalAmount,
  });

  // Increment coupon usage count
  await coupon.incrementUsage();

  res.status(200).json({
    success: true,
    message: "Coupon applied to transaction",
    data: {
      discountAmount,
      finalAmount,
    },
  });
});
