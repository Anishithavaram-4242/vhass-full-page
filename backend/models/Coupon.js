import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },

    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },

    minimumAmount: {
      type: Number,
      default: 0,
    },

    maximumDiscount: {
      type: Number,
      default: null,
    },

    validFrom: {
      type: Date,
      required: true,
    },

    validUntil: {
      type: Date,
      required: true,
    },

    usageLimit: {
      type: Number,
      default: null, // null means unlimited
    },

    usedCount: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    applicableCourses: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    }],

    applicableWorkshops: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workshop",
    }],

    // If empty, applies to all courses/workshops
    isGlobal: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
schema.index({ code: 1 });
schema.index({ isActive: 1, validFrom: 1, validUntil: 1 });

// Method to check if coupon is valid
schema.methods.isValid = function() {
  const now = new Date();
  return (
    this.isActive &&
    now >= this.validFrom &&
    now <= this.validUntil &&
    (this.usageLimit === null || this.usedCount < this.usageLimit)
  );
};

// Method to calculate discount amount
schema.methods.calculateDiscount = function(originalAmount) {
  if (originalAmount < this.minimumAmount) {
    return 0;
  }

  let discountAmount = 0;
  
  if (this.discountType === "percentage") {
    discountAmount = (originalAmount * this.discountValue) / 100;
  } else {
    discountAmount = this.discountValue;
  }

  // Apply maximum discount limit if set
  if (this.maximumDiscount && discountAmount > this.maximumDiscount) {
    discountAmount = this.maximumDiscount;
  }

  // Ensure discount doesn't exceed original amount
  return Math.min(discountAmount, originalAmount);
};

// Method to increment usage count
schema.methods.incrementUsage = function() {
  this.usedCount += 1;
  return this.save();
};

export const Coupon = mongoose.model("Coupon", schema);
