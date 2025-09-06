import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Plus, Edit, Trash2, Eye, Calendar, Users, Tag } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

const CouponManagement = () => {
  const { user } = useAuth();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    minimumAmount: '',
    maximumDiscount: '',
    validFrom: '',
    validUntil: '',
    usageLimit: '',
    isGlobal: true,
    applicableCourses: [],
    applicableWorkshops: [],
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await fetch('/api/coupon/all', {
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        setCoupons(data.data);
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingCoupon 
        ? `/api/coupon/${editingCoupon._id}`
        : '/api/coupon/create';
      
      const method = editingCoupon ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (data.success) {
        setShowForm(false);
        setEditingCoupon(null);
        resetForm();
        fetchCoupons();
        alert(editingCoupon ? 'Coupon updated successfully!' : 'Coupon created successfully!');
      } else {
        alert(data.message || 'Error saving coupon');
      }
    } catch (error) {
      console.error('Error saving coupon:', error);
      alert('Error saving coupon');
    }
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue.toString(),
      minimumAmount: coupon.minimumAmount.toString(),
      maximumDiscount: coupon.maximumDiscount?.toString() || '',
      validFrom: new Date(coupon.validFrom).toISOString().split('T')[0],
      validUntil: new Date(coupon.validUntil).toISOString().split('T')[0],
      usageLimit: coupon.usageLimit?.toString() || '',
      isGlobal: coupon.isGlobal,
      applicableCourses: coupon.applicableCourses || [],
      applicableWorkshops: coupon.applicableWorkshops || [],
    });
    setShowForm(true);
  };

  const handleDelete = async (couponId) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    
    try {
      const response = await fetch(`/api/coupon/${couponId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      const data = await response.json();
      
      if (data.success) {
        fetchCoupons();
        alert('Coupon deleted successfully!');
      } else {
        alert(data.message || 'Error deleting coupon');
      }
    } catch (error) {
      console.error('Error deleting coupon:', error);
      alert('Error deleting coupon');
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      description: '',
      discountType: 'percentage',
      discountValue: '',
      minimumAmount: '',
      maximumDiscount: '',
      validFrom: '',
      validUntil: '',
      usageLimit: '',
      isGlobal: true,
      applicableCourses: [],
      applicableWorkshops: [],
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const isCouponValid = (coupon) => {
    const now = new Date();
    return (
      coupon.isActive &&
      now >= new Date(coupon.validFrom) &&
      now <= new Date(coupon.validUntil) &&
      (coupon.usageLimit === null || coupon.usedCount < coupon.usageLimit)
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center" style={{ color: "#FFFFF0" }}>
          Loading coupons...
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold" style={{ color: "#FFFFF0" }}>
          Coupon Management
        </h1>
        <Button
          onClick={() => {
            setShowForm(true);
            setEditingCoupon(null);
            resetForm();
          }}
          style={{ backgroundColor: "#B88AFF", color: "#FFFFF0" }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Coupon
        </Button>
      </div>

      {/* Coupon Form */}
      {showForm && (
        <Card className="mb-8" style={{ backgroundColor: "rgba(0, 0, 0, 0.8)", borderColor: "#B88AFF" }}>
          <CardHeader>
            <CardTitle style={{ color: "#FFFFF0" }}>
              {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="code" style={{ color: "#B88AFF" }}>Coupon Code</Label>
                  <Input
                    id="code"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    required
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", borderColor: "#B88AFF", color: "#FFFFF0" }}
                  />
                </div>
                
                <div>
                  <Label htmlFor="description" style={{ color: "#B88AFF" }}>Description</Label>
                  <Input
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", borderColor: "#B88AFF", color: "#FFFFF0" }}
                  />
                </div>

                <div>
                  <Label htmlFor="discountType" style={{ color: "#B88AFF" }}>Discount Type</Label>
                  <Select
                    value={formData.discountType}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, discountType: value }))}
                  >
                    <SelectTrigger style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", borderColor: "#B88AFF", color: "#FFFFF0" }}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="discountValue" style={{ color: "#B88AFF" }}>
                    Discount Value {formData.discountType === 'percentage' ? '(%)' : '(₹)'}
                  </Label>
                  <Input
                    id="discountValue"
                    name="discountValue"
                    type="number"
                    value={formData.discountValue}
                    onChange={handleInputChange}
                    required
                    min="0"
                    max={formData.discountType === 'percentage' ? "100" : undefined}
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", borderColor: "#B88AFF", color: "#FFFFF0" }}
                  />
                </div>

                <div>
                  <Label htmlFor="minimumAmount" style={{ color: "#B88AFF" }}>Minimum Amount (₹)</Label>
                  <Input
                    id="minimumAmount"
                    name="minimumAmount"
                    type="number"
                    value={formData.minimumAmount}
                    onChange={handleInputChange}
                    min="0"
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", borderColor: "#B88AFF", color: "#FFFFF0" }}
                  />
                </div>

                <div>
                  <Label htmlFor="maximumDiscount" style={{ color: "#B88AFF" }}>Maximum Discount (₹)</Label>
                  <Input
                    id="maximumDiscount"
                    name="maximumDiscount"
                    type="number"
                    value={formData.maximumDiscount}
                    onChange={handleInputChange}
                    min="0"
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", borderColor: "#B88AFF", color: "#FFFFF0" }}
                  />
                </div>

                <div>
                  <Label htmlFor="validFrom" style={{ color: "#B88AFF" }}>Valid From</Label>
                  <Input
                    id="validFrom"
                    name="validFrom"
                    type="date"
                    value={formData.validFrom}
                    onChange={handleInputChange}
                    required
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", borderColor: "#B88AFF", color: "#FFFFF0" }}
                  />
                </div>

                <div>
                  <Label htmlFor="validUntil" style={{ color: "#B88AFF" }}>Valid Until</Label>
                  <Input
                    id="validUntil"
                    name="validUntil"
                    type="date"
                    value={formData.validUntil}
                    onChange={handleInputChange}
                    required
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", borderColor: "#B88AFF", color: "#FFFFF0" }}
                  />
                </div>

                <div>
                  <Label htmlFor="usageLimit" style={{ color: "#B88AFF" }}>Usage Limit</Label>
                  <Input
                    id="usageLimit"
                    name="usageLimit"
                    type="number"
                    value={formData.usageLimit}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="Leave empty for unlimited"
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", borderColor: "#B88AFF", color: "#FFFFF0" }}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  style={{ backgroundColor: "#B88AFF", color: "#FFFFF0" }}
                >
                  {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingCoupon(null);
                    resetForm();
                  }}
                  style={{ borderColor: "#B88AFF", color: "#B88AFF" }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Coupons List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((coupon) => (
          <Card key={coupon._id} style={{ backgroundColor: "rgba(0, 0, 0, 0.8)", borderColor: "#B88AFF" }}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2" style={{ color: "#FFFFF0" }}>
                    <Tag size={20} />
                    {coupon.code}
                  </CardTitle>
                  <p className="text-sm mt-1" style={{ color: "#B88AFF" }}>
                    {coupon.description}
                  </p>
                </div>
                <Badge
                  variant={isCouponValid(coupon) ? "default" : "secondary"}
                  style={{
                    backgroundColor: isCouponValid(coupon) ? "#22c55e" : "#6b7280",
                    color: "#FFFFF0"
                  }}
                >
                  {isCouponValid(coupon) ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span style={{ color: "#B88AFF" }}>Discount:</span>
                  <span style={{ color: "#FFFFF0" }}>
                    {coupon.discountValue}
                    {coupon.discountType === 'percentage' ? '%' : '₹'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span style={{ color: "#B88AFF" }}>Min Amount:</span>
                  <span style={{ color: "#FFFFF0" }}>₹{coupon.minimumAmount}</span>
                </div>

                <div className="flex justify-between">
                  <span style={{ color: "#B88AFF" }}>Used:</span>
                  <span style={{ color: "#FFFFF0" }}>
                    {coupon.usedCount}
                    {coupon.usageLimit ? ` / ${coupon.usageLimit}` : ' / ∞'}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span style={{ color: "#B88AFF" }}>Valid Until:</span>
                  <span style={{ color: "#FFFFF0" }}>
                    {new Date(coupon.validUntil).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    onClick={() => handleEdit(coupon)}
                    style={{ backgroundColor: "#B88AFF", color: "#FFFFF0" }}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(coupon._id)}
                    style={{ borderColor: "#ef4444", color: "#ef4444" }}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {coupons.length === 0 && (
        <div className="text-center py-12" style={{ color: "#FFFFF0" }}>
          <Tag size={48} className="mx-auto mb-4 opacity-50" />
          <p>No coupons found. Create your first coupon to get started!</p>
        </div>
      )}
    </div>
  );
};

export default CouponManagement;
