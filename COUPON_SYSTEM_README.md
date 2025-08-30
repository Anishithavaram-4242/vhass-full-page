# Coupon Code Discount System

This document describes the comprehensive coupon code discount system implemented for the VHASS Academy platform.

## Features

### 🎯 Core Functionality
- **Coupon Validation**: Real-time validation of coupon codes
- **Multiple Discount Types**: Percentage and fixed amount discounts
- **Usage Tracking**: Prevent multiple uses by the same user
- **Expiration Management**: Automatic validation of coupon dates
- **Minimum Amount Requirements**: Set minimum purchase amounts
- **Maximum Discount Limits**: Cap the maximum discount amount
- **Global vs Specific**: Apply to all courses or specific courses/workshops

### 🔧 Technical Features
- **RESTful API**: Complete CRUD operations for coupons
- **Admin Management**: Full admin interface for coupon management
- **Transaction Integration**: Seamless integration with payment system
- **Database Tracking**: Comprehensive usage and transaction tracking
- **Security**: User-specific coupon usage prevention

## Database Schema

### Coupon Model
```javascript
{
  code: String (unique, uppercase),
  description: String,
  discountType: "percentage" | "fixed",
  discountValue: Number,
  minimumAmount: Number,
  maximumDiscount: Number,
  validFrom: Date,
  validUntil: Date,
  usageLimit: Number (null for unlimited),
  usedCount: Number,
  isActive: Boolean,
  applicableCourses: [ObjectId],
  applicableWorkshops: [ObjectId],
  isGlobal: Boolean,
  createdBy: ObjectId
}
```

### CouponUsage Model
```javascript
{
  userId: ObjectId,
  couponId: ObjectId,
  transactionId: ObjectId,
  courseId: ObjectId,
  workshopId: ObjectId,
  originalAmount: Number,
  discountAmount: Number,
  finalAmount: Number,
  usedAt: Date
}
```

## API Endpoints

### User Endpoints
- `POST /api/coupon/validate` - Validate and apply coupon
- `POST /api/coupon/apply` - Apply coupon to transaction

### Admin Endpoints
- `POST /api/coupon/create` - Create new coupon
- `GET /api/coupon/all` - Get all coupons
- `GET /api/coupon/:id` - Get specific coupon
- `PUT /api/coupon/:id` - Update coupon
- `DELETE /api/coupon/:id` - Delete coupon
- `GET /api/coupon/:id/stats` - Get coupon usage statistics

## Frontend Components

### CouponInput Component
A reusable component for coupon input and validation:
- Real-time validation
- Visual feedback for applied coupons
- Price breakdown display
- Error handling

### CouponManagement Component
Admin interface for managing coupons:
- Create, edit, and delete coupons
- View coupon statistics
- Bulk operations
- Search and filter

## Usage Examples

### Creating a Coupon (Admin)
```javascript
const couponData = {
  code: "WELCOME20",
  description: "Welcome discount for new users",
  discountType: "percentage",
  discountValue: 20,
  minimumAmount: 1000,
  maximumDiscount: 5000,
  validFrom: "2024-01-01",
  validUntil: "2024-12-31",
  usageLimit: 100,
  isGlobal: true
};

const response = await fetch('/api/coupon/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify(couponData)
});
```

### Validating a Coupon (User)
```javascript
const validationData = {
  code: "WELCOME20",
  courseId: "course_id_here",
  amount: 2500
};

const response = await fetch('/api/coupon/validate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify(validationData)
});
```

## Sample Coupons

The system includes sample coupons for testing:

1. **WELCOME20** - 20% off for new users (min ₹1000, max ₹5000 discount)
2. **CYBER50** - 50% off on cybersecurity courses (min ₹500, max ₹10000 discount)
3. **FLAT1000** - Flat ₹1000 off any course (min ₹2000 purchase)
4. **STUDENT25** - 25% student discount (unlimited usage)

## Setup Instructions

### 1. Database Setup
The coupon models are automatically created when the application starts.

### 2. Seed Sample Data
Run the seeding script to add sample coupons:
```bash
cd backend
node seedCoupons.js
```

### 3. Admin Access
Ensure you have admin privileges to access coupon management features.

### 4. Integration
The coupon system is automatically integrated into:
- Course enrollment forms
- Workshop enrollment forms
- Payment processing

## Validation Rules

### Coupon Validation
1. **Code Exists**: Coupon code must exist in database
2. **Active Status**: Coupon must be active
3. **Date Range**: Current date must be within validFrom and validUntil
4. **Usage Limit**: Must not exceed usage limit
5. **User Usage**: User must not have used this coupon before
6. **Applicability**: Must be applicable to the specific course/workshop
7. **Minimum Amount**: Purchase amount must meet minimum requirement

### Discount Calculation
1. **Percentage Discount**: `discount = (amount * percentage) / 100`
2. **Fixed Discount**: `discount = fixed_amount`
3. **Maximum Limit**: Apply maximum discount limit if set
4. **Final Amount**: `final_amount = original_amount - discount`

## Security Features

- **User-specific Usage**: Each user can only use a coupon once
- **Admin-only Management**: Only admins can create/edit coupons
- **Input Validation**: Comprehensive server-side validation
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Input sanitization

## Error Handling

The system provides clear error messages for:
- Invalid coupon codes
- Expired coupons
- Already used coupons
- Insufficient purchase amount
- Coupon not applicable to course/workshop

## Monitoring and Analytics

### Usage Statistics
- Total usage count per coupon
- Total discount amount given
- Total revenue generated
- Usage trends over time

### Admin Dashboard
- Real-time coupon status
- Usage analytics
- Performance metrics
- Revenue impact analysis

## Future Enhancements

### Planned Features
- **Bulk Coupon Generation**: Generate multiple coupons at once
- **Email Integration**: Send coupon codes via email
- **Referral System**: Coupons for referrals
- **Seasonal Campaigns**: Automated seasonal coupon creation
- **A/B Testing**: Test different coupon strategies
- **Analytics Dashboard**: Advanced analytics and reporting

### Technical Improvements
- **Caching**: Redis caching for better performance
- **Rate Limiting**: Prevent abuse of coupon validation
- **Webhooks**: Real-time notifications for coupon usage
- **API Versioning**: Versioned API endpoints

## Troubleshooting

### Common Issues

1. **Coupon Not Working**
   - Check if coupon is active
   - Verify date range
   - Ensure minimum amount requirement is met
   - Check if user has already used the coupon

2. **Admin Access Issues**
   - Verify admin privileges
   - Check authentication status
   - Ensure proper session management

3. **Database Issues**
   - Check MongoDB connection
   - Verify indexes are created
   - Check for duplicate coupon codes

### Debug Mode
Enable debug logging by setting `NODE_ENV=development` to see detailed error messages and validation steps.

## Support

For technical support or questions about the coupon system:
1. Check the application logs
2. Review the API documentation
3. Contact the development team
4. Check the GitHub repository for issues

---

**Version**: 1.0.0  
**Last Updated**: December 2024  
**Maintainer**: VHASS Development Team
