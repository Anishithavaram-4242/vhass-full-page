// Removed import of instance (Razorpay) from "../index.js"
// import { instance } from "../index.js";
import TryCatch from "../middlewares/TryCatch.js";
import { Courses } from "../models/Courses.js";
import { Lecture } from "../models/Lecture.js";
import { User } from "../models/User.js";
import { Transaction } from "../models/Transaction.js";
import { Progress } from "../models/Progress.js";
import pkg from 'pg-sdk-node';
import mongoose from "mongoose";
import { randomUUID } from 'crypto';
const { PhonePeClient, StandardCheckoutPayRequest, StandardCheckoutClient, Env, CreateSdkOrderRequest } = pkg;

import { sendTransactMailAdmin, sendTransactMailUser } from "../middlewares/sendMail.js";
import { time } from "console";
import { title } from "process";
// Initialize PhonePe SDK client
// const client = new PhonePeClient({
//   merchantId: 'SU2505141931362838820920',
//   saltKey: '33418406-0957-4ae0-a07a-a6383760ba05',
//   saltIndex: 1,
//   env: 'PRODUCTION',
// });

// Initialize PhonePe StandardCheckoutClient (use env vars; supports PREPROD)
let sdkClient = null;
function getPhonePeClient() {
  if (sdkClient) return sdkClient;
  
  const cid = process.env.PHONEPE_SDK_CLIENT_ID || process.env.PHONEPE_MERCHANT_ID;
  const csecret = process.env.PHONEPE_SDK_CLIENT_SECRET || process.env.PHONEPE_SALT_KEY;
  const cver = Number(process.env.PHONEPE_SDK_VERSION || 1);
  const cenv = (process.env.PHONEPE_ENVIRONMENT || 'PREPROD').toUpperCase() === 'PRODUCTION' ? Env.PRODUCTION : Env.PREPROD;
  
  console.log('🔧 PhonePe SDK Configuration:');
  console.log('  Client ID:', cid ? 'Set' : 'Missing');
  console.log('  Client Secret:', csecret ? 'Set' : 'Missing');
  console.log('  Version:', cver);
  console.log('  Environment:', cenv);
  
  try {
    console.log('🚀 Attempting to initialize PhonePe SDK with credentials...');
    sdkClient = StandardCheckoutClient.getInstance(cid, csecret, cver, cenv);
    console.log('✅ PhonePe SDK initialized successfully with credentials');
    return sdkClient;
  } catch (e) {
    console.log('⚠️ Failed to initialize with credentials, trying default...');
    try {
      sdkClient = StandardCheckoutClient.getInstance();
      console.log('✅ PhonePe SDK initialized with default config');
      return sdkClient;
    } catch (defaultError) {
      console.error('❌ Failed to initialize PhonePe SDK:', defaultError.message);
      return null;
    }
  }
}

export const getAllCourses = TryCatch(async (req, res) => {
  const courses = await Courses.find();
  // console.log('Courses from database:', courses);
  res.json({
    courses,
  });
});

export const getSingleCourse = TryCatch(async (req, res) => {
  const course = await Courses.findById(req.params.id);

  res.json({
    course,
  });
});

export const fetchLectures = TryCatch(async (req, res) => {
  const lectures = await Lecture.find({ course: req.params.id });

  const user = await User.findById(req.user._id);

  if (user.role === "admin") {
    return res.json({ lectures });
  }

  if (!user.subscription.includes(req.params.id))
    return res.status(400).json({
      message: "You have not subscribed to this course",
    });

  res.json({ lectures });
});

export const fetchLecture = TryCatch(async (req, res) => {
  const lecture = await Lecture.findById(req.params.id);

  const user = await User.findById(req.user._id);

  if (user.role === "admin") {
    return res.json({ lecture });
  }

  if (!user.subscription.includes(lecture.course))
    return res.status(400).json({
      message: "You have not subscribed to this course",
    });

  res.json({ lecture });
});

export const getMyCourses = TryCatch(async (req, res) => {
  const courses = await Courses.find({ _id: req.user.subscription });

  res.json({
    courses,
  });
});

export const getUserCourses = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id).populate('subscription');
  
  const courses = user.subscription.map(courseId => {
    if (typeof courseId === 'string') {
      return { _id: courseId, title: 'Course', description: 'Course description' };
    }
    return courseId;
  });

  res.json({
    courses,
  });
});

export const getUserWorkshops = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id).populate('workshopSubscription');
  
  const workshops = user.workshopSubscription ? user.workshopSubscription.map(workshopId => {
    if (typeof workshopId === 'string') {
      return { _id: workshopId, title: 'Workshop', description: 'Workshop description' };
    }
    return workshopId;
  }) : [];

  res.json({
    workshops,
  });
});

export const getEnrollmentHistory = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  // Get course enrollments
  const courseEnrollments = await Courses.find({ _id: { $in: user.subscription } })
    .select('title category')
    .lean();
  
  // Get workshop enrollments (if workshop model exists)
  const workshopEnrollments = []; // Placeholder for workshop enrollments
  
  const history = [
    ...courseEnrollments.map(course => ({
      _id: course._id,
      title: course.title,
      type: 'course',
      enrollmentDate: new Date(),
      status: 'enrolled'
    })),
    ...workshopEnrollments.map(workshop => ({
      _id: workshop._id,
      title: workshop.title,
      type: 'workshop',
      enrollmentDate: new Date(),
      status: 'registered'
    }))
  ];

  res.json({
    history,
  });
});

export const addProgress = TryCatch(async (req, res) => {
  const progress = await Progress.findOne({
    user: req.user._id,
    course: req.query.course,
  });

  const { lectureId } = req.query;

  if (progress.completedLectures.includes(lectureId)) {
    return res.json({
      message: "Progress recorded",
    });
  }

  progress.completedLectures.push(lectureId);

  await progress.save();

  res.status(201).json({
    message: "new Progress added",
  });
});

export const getYourProgress = TryCatch(async (req, res) => {
  const progress = await Progress.find({
    user: req.user._id,
    course: req.query.course,
  });

  if (!progress) return res.status(404).json({ message: "null" });

  const allLectures = (await Lecture.find({ course: req.query.course })).length;

  const completedLectures = progress[0].completedLectures.length;

  const courseProgressPercentage = (completedLectures * 100) / allLectures;

  res.json({
    courseProgressPercentage,
    completedLectures,
    allLectures,
    progress,
  });
});

export const phonepeCheckout = async (req, res) => {
  try {
    console.log('🚀 PhonePe checkout initiated for course:', req.params.id);
    console.log('👤 User ID:', req.user._id);
    console.log('📝 Request body:', req.body);

    const user = await User.findById(req.user._id);
    const course = await Courses.findById(req.params.id);
    
    if (!user || !course) {
      console.log('❌ User or course not found');
      return res.status(404).json({ message: 'User or course not found' });
    }
    
    if (user.subscription.includes(course._id)) {
      console.log('❌ User already has this course');
      return res.status(400).json({ message: 'You already have this course' });
    }

    // Coupon support removed: always use course price as final amount
    const originalAmount = Number(course.price);
    const finalAmount = originalAmount;
    const discountAmount = 0;

    const merchantOrderId = randomUUID();
    const amount = Math.round(finalAmount * 100); // in paise

    // Log SDK config for debugging
    console.log('=== PHONEPE SDK CONFIG (COURSE) ===');
    console.log('Client ID:', process.env.PHONEPE_SDK_CLIENT_ID || process.env.PHONEPE_MERCHANT_ID);
    console.log('Environment:', (process.env.PHONEPE_ENVIRONMENT || 'PREPROD'));
    console.log('Original Amount:', originalAmount);
    console.log('Final Amount:', finalAmount);
    console.log('Discount Amount:', discountAmount);
    console.log('Amount (paise):', amount);
    console.log('Merchant Order ID:', merchantOrderId);

    const redirectBase = process.env.PHONEPE_REDIRECT_URL || 'http://localhost:5173';
    
    // Create transaction with coupon information
    console.log('💾 Creating transaction...');
    const txn = await Transaction.create({
      courseID: course._id,
      merchantOrderID: merchantOrderId,
      transactionAmount: finalAmount,
      originalAmount: originalAmount,
      discountAmount: discountAmount,
      finalAmount: finalAmount,
      couponCode: null,
      transactionStatus: "PENDING",
    });
    console.log('✅ Transaction created:', txn._id);

    const redirectUrl = `${redirectBase}/payment-success/${merchantOrderId}`;
    console.log('🔗 Redirect URL:', redirectUrl);
    
    console.log('🏗️ Building PhonePe request...');
    const request = StandardCheckoutPayRequest.builder()
      .merchantOrderId(merchantOrderId)
      .amount(amount)
      .redirectUrl(redirectUrl)
      .build();
    
    console.log('📱 PhonePe request built:', request);
    
    console.log('🔌 Getting PhonePe client...');
    const client = getPhonePeClient();
    if (!client) {
      throw new Error('Failed to initialize PhonePe client');
    }
    console.log('✅ PhonePe client initialized');
    
    console.log('🚀 Calling PhonePe pay API...');
    const response = await client.pay(request);
    console.log('📱 PhonePe response received:', response);
    
    const checkoutPageUrl = response.redirectUrl;
    if (!checkoutPageUrl) {
      throw new Error('PhonePe response missing redirectUrl');
    }
    
    console.log('✅ Sending success response with checkout URL');
    res.json({ 
      success: true,
      checkoutPageUrl,
      merchantOrderId,
      amount: finalAmount
    });
    
  } catch (err) {
    console.error('❌ PhonePe checkout error:', err);
    console.error('Error details:', {
      message: err.message,
      stack: err.stack,
      response: err.response?.data
    });
    
    res.status(500).json({
      success: false,
      message: 'Payment gateway error',
      error: err.message || 'Unknown error occurred'
    });
  }
};

export const phonepeStatus = TryCatch(async (req, res) => {
  const merchantOrderId = req.params.merchantOrderId;
  console.log("phonepeStatus (course) – merchantOrderId:", merchantOrderId);

  const user = await User.findById(req.user._id);

  const userID = user._id;
  const userEmail = user.email;

  const client = getPhonePeClient();
  const statusResponse = await client.getOrderStatus(merchantOrderId);

  console.log("PhonePe getOrderStatus response:", statusResponse);

  const transactionID = statusResponse.paymentDetails[0].transactionId;

  const transactionMode = statusResponse.paymentDetails[0].paymentMode;

  const transactionStatus = statusResponse.state;

  if (statusResponse.state === "COMPLETED") {
    console.log("Payment completed successfully");
    await Transaction.findOneAndUpdate(
      { merchantOrderID : merchantOrderId },
      {
        userID : userID,
        userEmail : userEmail,
        transactionID: transactionID,
        transactionType: transactionMode,
        transactionStatus: transactionStatus,
        updatedAt: Date.now()
      }
    );
    console.log("Transaction updated successfully");
    const txn = await Transaction.findOne({
      merchantOrderID: merchantOrderId,
    });
    console.log("Transaction found:", txn);
    // Add course to user's subscription
    await User.findByIdAndUpdate(user._id, {
      $addToSet: { subscription: txn.courseID },
    });

    await Courses.findByIdAndUpdate(txn.courseID, {
      $addToSet: { purchasers: user._id },
    });

    console.log("User subscription updated successfully");

    const course = await Courses.findById(txn.courseID);

    const data = {
      name: user.name,
      email: user.email,
      course: course.title,
      txnid: transactionID,
      stat: transactionStatus,
      time: txn.updatedAt,
    };

    await sendTransactMailAdmin("Somone Bought your course",data);

    const data_user = {
      name: user.name,
      email: user.email,
      course: course.title,
      txnid: transactionID,
      stat: transactionStatus,
      time: txn.updatedAt,
    };

    await sendTransactMailUser("Your course purchase was successful! Welcome aboard 🚀",data_user);

    return res.json({ message: "nice", status: "SUCCESS", merchantOrderId, txnid: transactionID });
  } else if (statusResponse.state === "FAILED") {
    console.log("Payment completed failed");
    await Transaction.findOneAndUpdate(
      { merchantOrderID : merchantOrderId },
      {
        userID : userID,
        userEmail : userEmail,
        transactionID: transactionID,
        transactionType: transactionMode,
        transactionStatus: transactionStatus,
        updatedAt: Date.now()
      }
    );
    console.log("Transaction updated failed");

    const txn = await Transaction.findOne({
      merchantOrderID: merchantOrderId,
    });

    const course = await Courses.findById(txn.courseID);

    const data_user = {
      name: user.name,
      email: user.email,
      course: course.title,
      txnid: transactionID,
      stat: transactionStatus,
      time: txn.updatedAt,
    };

    await sendTransactMailUser("Course Enrollment not completed ⚠️", data_user);

    return res.json({ message: "bad", status: "FAILURE", merchantOrderId });
  } else {
    return res.json({ message: "pending", status: "PENDING", merchantOrderId });
  }
});

// Add createCourse function
export const createCourse = TryCatch(async (req, res) => {
  console.log('Creating course - Request body:', req.body);
  
  const { 
    title, 
    description, 
    originalPrice,
    discountedPrice,
    category, 
    duration, 
    createdBy,
    poster,
    syllabus,
    whoShouldAttend,
    prerequisites 
  } = req.body;
  
  // Validate required fields
  if (!title || !description || !originalPrice || !discountedPrice || !category || !duration || !createdBy || !poster) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields",
      missingFields: {
        title: !title,
        description: !description,
        originalPrice: !originalPrice,
        discountedPrice: !discountedPrice,
        category: !category,
        duration: !duration,
        createdBy: !createdBy,
        poster: !poster
      }
    });
  }

  try {
    // Validate data types and prices
    if (isNaN(Number(originalPrice)) || isNaN(Number(discountedPrice)) || isNaN(Number(duration))) {
      return res.status(400).json({
        success: false,
        message: "Prices and duration must be valid numbers"
      });
    }

    // Validate that discounted price is less than original price
    if (Number(discountedPrice) >= Number(originalPrice)) {
      return res.status(400).json({
        success: false,
        message: "Discounted price must be less than original price"
      });
    }

    const course = await Courses.create({
      title,
      description,
      originalPrice: Number(originalPrice),
      discountedPrice: Number(discountedPrice),
      price: Number(discountedPrice),
      category,
      duration: Number(duration),
      createdBy,
      image: poster,
      syllabus: syllabus || [],
      whoShouldAttend: whoShouldAttend || [],
      prerequisites: prerequisites || []
    });

    console.log('Course created successfully:', course);

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      course
    });
  } catch (error) {
    console.error('Error creating course:', error);
    
    // Handle specific MongoDB errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: Object.values(error.errors).map(err => err.message)
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "A course with this title already exists"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message
    });
  }
});

// Utility: Ensure all courses have a price field
export async function ensureCoursePrices() {
  const courses = await Courses.find();
  for (const course of courses) {
    if (typeof course.price !== 'number' || isNaN(course.price) || course.price <= 0) {
      let newPrice = Number(course.discountedPrice) || Number(course.originalPrice) || 1000;
      course.price = newPrice;
      await course.save();
      console.log(`Updated course ${course._id} with price:`, newPrice);
    }
  }
}

// Call this function manually from a script or at server start for a one-time fix
// ensureCoursePrices();
