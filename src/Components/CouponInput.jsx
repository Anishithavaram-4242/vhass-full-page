import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Check, X, Tag } from 'lucide-react';

// Temporary sample coupons (client-side validation)
const SAMPLE_COUPONS = {
  'WELCOME20': {
    code: 'WELCOME20',
    description: 'Welcome discount for new users',
    discountType: 'percentage',
    discountValue: 20,
    minimumAmount: 1000,
    maximumDiscount: 5000,
    validFrom: '2024-01-01',
    validUntil: '2024-12-31',
    isActive: true
  },
  'CYBER50': {
    code: 'CYBER50',
    description: '50% off on cybersecurity courses',
    discountType: 'percentage',
    discountValue: 50,
    minimumAmount: 500,
    maximumDiscount: 10000,
    validFrom: '2024-01-01',
    validUntil: '2024-06-30',
    isActive: true
  },
  'FLAT1000': {
    code: 'FLAT1000',
    description: 'Flat ₹1000 off on any course',
    discountType: 'fixed',
    discountValue: 1000,
    minimumAmount: 2000,
    maximumDiscount: 1000,
    validFrom: '2024-01-01',
    validUntil: '2024-12-31',
    isActive: true
  },
  'STUDENT25': {
    code: 'STUDENT25',
    description: 'Student discount on all courses',
    discountType: 'percentage',
    discountValue: 25,
    minimumAmount: 500,
    maximumDiscount: 5000,
    validFrom: '2024-01-01',
    validUntil: '2024-12-31',
    isActive: true
  }
};

const CouponInput = ({ 
  onCouponApplied, 
  onCouponRemoved, 
  originalAmount, 
  courseId, 
  workshopId,
  disabled = false 
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Server-side coupon validation
  const validateCoupon = async () => {
    if (!couponCode.trim()) {
      setError('Please enter a coupon code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Use course route endpoint as temporary workaround
      const response = await fetch('/api/course/validate-coupon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          code: couponCode.trim(),
          courseId,
          workshopId,
          amount: originalAmount,
        }),
      });

      console.log('Coupon validation response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('Coupon validation error response:', errorText);
        
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.message || 'Coupon validation failed');
        } catch (parseError) {
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
      }

      const data = await response.json();
      console.log('Coupon validation success:', data);

      if (data.success) {
        setAppliedCoupon(data.data);
        setError('');
        onCouponApplied(data.data);
      } else {
        setError(data.message || 'Invalid coupon code');
        setAppliedCoupon(null);
        onCouponRemoved();
      }
    } catch (err) {
      console.error('Coupon validation error:', err);
      setError(err.message || 'Failed to validate coupon. Please try again.');
      setAppliedCoupon(null);
      onCouponRemoved();
    } finally {
      setIsLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setError('');
    onCouponRemoved();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      validateCoupon();
    }
  };

  return (
    <div className="space-y-4">
      {/* Coupon Input Section */}
      {!appliedCoupon && (
        <div className="space-y-3">
          <Label htmlFor="coupon" className="text-lg" style={{ color: "#B88AFF" }}>
            Have a coupon code?
          </Label>
          <div className="flex gap-2">
            <Input
              id="coupon"
              type="text"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              onKeyPress={handleKeyPress}
              disabled={disabled || isLoading}
              className="flex-1"
              style={{ 
                backgroundColor: "rgba(255, 255, 255, 0.1)", 
                border: "1px solid #B88AFF", 
                color: "#FFFFF0" 
              }}
            />
            <Button
              type="button"
              onClick={validateCoupon}
              disabled={disabled || isLoading || !couponCode.trim()}
              style={{ backgroundColor: "#B88AFF", color: "#FFFFF0" }}
              className="px-4"
            >
              {isLoading ? "Validating..." : "Apply"}
            </Button>
          </div>
          {error && (
            <p className="text-red-400 text-sm flex items-center gap-1">
              <X size={16} />
              {error}
            </p>
          )}
          {/* Sample coupon codes hint */}
          <p className="text-xs text-gray-400">
            Try: WELCOME20, CYBER50, FLAT1000, STUDENT25
          </p>
        </div>
      )}

      {/* Applied Coupon Display */}
      {appliedCoupon && (
        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Check size={20} className="text-green-400" />
              <div>
                <p className="text-green-400 font-semibold flex items-center gap-2">
                  <Tag size={16} />
                  {appliedCoupon.coupon.code}
                </p>
                <p className="text-green-300 text-sm">
                  {appliedCoupon.coupon.description}
                </p>
              </div>
            </div>
            <Button
              type="button"
              onClick={removeCoupon}
              variant="outline"
              size="sm"
              style={{ borderColor: "#B88AFF", color: "#B88AFF" }}
            >
              Remove
            </Button>
          </div>
          
          {/* Price Breakdown */}
          <div className="mt-3 space-y-1 text-sm">
            <div className="flex justify-between">
              <span style={{ color: "#B88AFF" }}>Original Price:</span>
              <span style={{ color: "#FFFFF0" }}>₹{appliedCoupon.originalAmount}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "#B88AFF" }}>Discount:</span>
              <span className="text-green-400">-₹{appliedCoupon.discountAmount}</span>
            </div>
            <div className="flex justify-between font-semibold border-t border-green-500/30 pt-1">
              <span style={{ color: "#B88AFF" }}>Final Price:</span>
              <span className="text-green-400">₹{appliedCoupon.finalAmount}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponInput;
