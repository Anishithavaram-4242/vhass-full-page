import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Check, X, Tag } from 'lucide-react';

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

  const validateCoupon = async () => {
    if (!couponCode.trim()) {
      setError('Please enter a coupon code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/coupon/validate', {
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

      const data = await response.json();

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
      setError('Failed to validate coupon. Please try again.');
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
