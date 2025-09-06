import mongoose from 'mongoose';
import { Coupon } from './models/Coupon.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: './config.env' });

const sampleCoupons = [
  {
    code: 'WELCOME20',
    description: 'Welcome discount for new users',
    discountType: 'percentage',
    discountValue: 20,
    minimumAmount: 1000,
    maximumDiscount: 5000,
    validFrom: new Date('2024-01-01'),
    validUntil: new Date('2025-12-31'),
    usageLimit: 100,
    isGlobal: true,
    isActive: true,
    createdBy: new mongoose.Types.ObjectId(), // Generate a new ObjectId
  },
  {
    code: 'CYBER50',
    description: '50% off on cybersecurity courses',
    discountType: 'percentage',
    discountValue: 50,
    minimumAmount: 500,
    maximumDiscount: 10000,
    validFrom: new Date('2024-01-01'),
    validUntil: new Date('2025-12-31'),
    usageLimit: 50,
    isGlobal: false,
    isActive: true,
    createdBy: new mongoose.Types.ObjectId(), // Generate a new ObjectId
  },
  {
    code: 'FLAT1000',
    description: 'Flat ₹1000 off on any course',
    discountType: 'fixed',
    discountValue: 1000,
    minimumAmount: 2000,
    maximumDiscount: 1000,
    validFrom: new Date('2024-01-01'),
    validUntil: new Date('2025-12-31'),
    usageLimit: 200,
    isGlobal: true,
    isActive: true,
    createdBy: new mongoose.Types.ObjectId(), // Generate a new ObjectId
  },
  {
    code: 'STUDENT25',
    description: 'Student discount on all courses',
    discountType: 'percentage',
    discountValue: 25,
    minimumAmount: 500,
    maximumDiscount: 5000,
    validFrom: new Date('2024-01-01'),
    validUntil: new Date('2025-12-31'),
    usageLimit: null, // Unlimited
    isGlobal: true,
    isActive: true,
    createdBy: new mongoose.Types.ObjectId(), // Generate a new ObjectId
  },
];

async function seedCoupons() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing coupons (optional)
    await Coupon.deleteMany({});
    console.log('🧹 Cleared existing coupons');

    // Insert sample coupons
    const createdCoupons = await Coupon.insertMany(sampleCoupons);
    console.log(`🎉 Created ${createdCoupons.length} sample coupons:`);
    
    createdCoupons.forEach(coupon => {
      console.log(`  - ${coupon.code}: ${coupon.description}`);
    });

    console.log('\n🎯 Test these coupon codes:');
    console.log('  WELCOME20 - 20% off (min ₹1000)');
    console.log('  CYBER50 - 50% off (min ₹500)');
    console.log('  FLAT1000 - Flat ₹1000 off (min ₹2000)');
    console.log('  STUDENT25 - 25% off (min ₹500)');

    console.log('\n✅ Coupon seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding coupons:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the seeding function
seedCoupons();
