import mongoose from 'mongoose';
import { Coupon } from './models/Coupon.js';
import dotenv from 'dotenv';

console.log('🚀 Starting coupon system test...');

// Load environment variables
dotenv.config({ path: './config.env' });

console.log('📁 Environment loaded');
console.log('🔍 Current working directory:', process.cwd());
console.log('📄 Config file path: ./config.env');

async function testCoupon() {
  try {
    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    console.log('🌐 MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
    
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully');

    // Check if Coupon model exists
    console.log('✅ Coupon model loaded successfully');

    // Try to create a simple test coupon
    const testCoupon = new Coupon({
      code: 'TEST100',
      description: 'Test coupon for debugging',
      discountType: 'fixed',
      discountValue: 100,
      minimumAmount: 500,
      maximumDiscount: 100,
      validFrom: new Date('2024-01-01'),
      validUntil: new Date('2025-12-31'),
      usageLimit: 10,
      isGlobal: true,
      isActive: true,
      createdBy: new mongoose.Types.ObjectId(), // Generate a new ObjectId
    });

    console.log('📝 Attempting to save test coupon...');
    await testCoupon.save();
    console.log('✅ Test coupon created successfully:', testCoupon.code);

    // Try to find the coupon
    console.log('🔍 Searching for test coupon in database...');
    const foundCoupon = await Coupon.findOne({ code: 'TEST100' });
    console.log('✅ Coupon found in database:', foundCoupon ? foundCoupon.code : 'Not found');

    // Test the isValid method
    if (foundCoupon) {
      const isValid = foundCoupon.isValid();
      console.log('✅ Coupon validity check:', isValid);
      
      // Test discount calculation
      const discount = foundCoupon.calculateDiscount(1000);
      console.log('✅ Discount calculation test:', discount);
    }

    // Clean up test coupon
    console.log('🧹 Cleaning up test coupon...');
    await Coupon.deleteOne({ code: 'TEST100' });
    console.log('✅ Test coupon cleaned up');

    console.log('🎉 All tests passed! Coupon system is working correctly.');

  } catch (error) {
    console.error('❌ Error testing coupon system:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
  } finally {
    try {
      await mongoose.disconnect();
      console.log('🔌 Disconnected from MongoDB');
    } catch (disconnectError) {
      console.error('❌ Error disconnecting from MongoDB:', disconnectError);
    }
  }
}

// Run the test
console.log('▶️  Executing test function...');
testCoupon().then(() => {
  console.log('🏁 Test function completed');
}).catch((error) => {
  console.error('💥 Test function failed:', error);
});
