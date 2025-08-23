"use client"

import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "../../components/ui2/button"
import { Input } from "../../components/ui2/input"
import { Label } from "../../components/ui2/label"
import { Phone, Mail, MapPin, Linkedin, Youtube, Instagram, ArrowLeft, X } from "lucide-react"
import Navbar from "../../components/navbar"
import { useAuth } from "../../context/AuthContext.jsx"
import phonepeService from "../../services/phonepeService.js"

// Helper function to construct proper image URL
const getImageUrl = (imagePath) => {
  // Handle null, undefined, or empty strings
  if (!imagePath || imagePath === 'null' || imagePath === 'undefined') {
    return "/images/circuit-board.png";
  }
  
  // If it's already a full URL (starts with http/https), return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it's a filename (no slashes), construct the uploads URL
  if (!imagePath.includes('/')) {
    return `/uploads/${imagePath}`;
  }
  
  // If it's a relative path starting with uploads/, return as is
  if (imagePath.startsWith('uploads/')) {
    return `/${imagePath}`;
  }
  
  // If it's already a relative path starting with /uploads/, return as is
  if (imagePath.startsWith('/uploads/')) {
    return imagePath;
  }
  
  // If it's a relative path, return as is
  return imagePath;
};

// No static data; fetch from backend

export default function WorkshopDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [loading, setLoading] = useState(true)
  const [workshop, setWorkshop] = useState(null)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    mobile: user?.phone || "",
  })

  useEffect(() => {
    const API = import.meta.env.VITE_API_URL || '/api'
    const load = async () => {
      try {
        const res = await fetch(`${API}/workshop/${slug}`, { credentials: 'include' })
        if (!res.ok) throw new Error('Failed to load workshop')
        const data = await res.json()
        setWorkshop(data.workshop)
      } catch (e) {
        console.error('Failed to fetch workshop:', e)
      } finally {
        setLoading(false)
      }
    }
    if (slug) load()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold" style={{ color: "#FFFFF0" }}>Loading...</h1>
        </div>
      </div>
    )
  }

  if (!workshop) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl font-bold mb-4" style={{ color: "#FFFFF0" }}>
            Workshop not found
          </h1>
          <Button
            onClick={() => navigate("/workshop")}
            style={{ backgroundColor: "#B88AFF", color: "#FFFFF0" }}
          >
            Back to Workshops
          </Button>
        </div>
      </div>
    )
  }

  const handleEnrollClick = () => {
    if (!user) {
      alert("Please login to enroll in this workshop!")
      navigate("/auth")
      return
    }
    setShowEnrollmentModal(true)
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setIsProcessingPayment(true)
    
    try {
      // Generate unique order ID
      const orderId = phonepeService.generateOrderId()
      
      // Extract amount (remove ₹ symbol and convert to number)
      const amount = parseInt(workshop.price.replace('₹', ''))
      
      // Prepare user data
      const userData = {
        userId: user._id,
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile
      }
      
      // Prepare workshop data
      const workshopData = {
        id: workshop.id,
        title: workshop.title,
        price: workshop.price
      }
      
      // Initialize PhonePe payment
      const paymentResponse = await phonepeService.initiatePayment(orderId, amount, userData, workshopData)
      
      if (paymentResponse.success) {
        // Save enrollment data with pending status
        const enrollmentData = {
          workshopId: workshop.id,
          workshopTitle: workshop.title,
          userId: user._id,
          userName: formData.name,
          userEmail: formData.email,
          userMobile: formData.mobile,
          amount: workshop.price,
          orderId: orderId,
          transactionId: paymentResponse.transactionId,
          paymentStatus: "pending",
          enrollmentDate: new Date().toISOString(),
          status: "payment_pending"
        }
        
        console.log("Workshop payment initiated:", enrollmentData)
        
        // Redirect to PhonePe payment page
        window.location.href = paymentResponse.paymentUrl
      } else {
        throw new Error('Payment initiation failed')
      }
    } catch (error) {
      console.error("PhonePe payment error:", error)
      alert("An error occurred while initiating payment. Please try again.")
      setIsProcessingPayment(false)
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          onClick={() => navigate("/workshop")}
          variant="ghost"
          className="mb-6 hover:opacity-80"
          style={{ color: "#FFFFF0", backgroundColor: "rgba(255, 255, 255, 0.1)", border: "1px solid #B88AFF" }}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Workshops
        </Button>

        {/* Workshop Hero Section */}
        <div className="text-center mb-12 py-16 rounded-3xl shadow-2xl" style={{ backgroundColor: "#000000" }}>
          <h1 className="text-4xl md:text-5xl font-bold mb-8" style={{ color: "#FFFFF0" }}>
            {workshop.title}
          </h1>
          <div className="max-w-4xl mx-auto mb-8">
            <img
              src={getImageUrl(workshop.image)}
              alt={workshop.title}
              className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-xl"
            />
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 text-lg">
            <span style={{ color: "#B88AFF" }}>{workshop.createdBy || workshop.instructor}</span>
            <span style={{ color: "#B88AFF" }}>{`Duration: ${workshop.duration} hours`}</span>
            <span className="text-3xl font-bold" style={{ color: "#FFFFF0" }}>
              {`₹${workshop.price}`}
            </span>
          </div>
        </div>

        {/* About This Workshop */}
        <section className="mb-12 p-8 rounded-2xl shadow-xl" style={{ backgroundColor: "rgba(0, 0, 0, 0.8)", border: "2px solid #B88AFF" }}>
          <h2 className="text-3xl font-bold mb-6 pb-4 border-b-4" style={{ color: "#FFFFF0", borderColor: "#B88AFF" }}>
            About This Workshop
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: "#B88AFF" }}>
            {workshop.about}
          </p>
        </section>

        {/* Syllabus */}
        <section className="mb-12 p-8 rounded-2xl shadow-xl" style={{ backgroundColor: "rgba(0, 0, 0, 0.8)", border: "2px solid #B88AFF" }}>
          <h2 className="text-3xl font-bold mb-6 pb-4 border-b-4" style={{ color: "#FFFFF0", borderColor: "#B88AFF" }}>
            Workshop Syllabus
          </h2>
          <div className="space-y-4">
            {(workshop.syllabus || []).map((item, index) => (
              <div key={index} className="p-4 rounded-lg" style={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}>
                <p className="text-lg" style={{ color: "#B88AFF" }}>
                  {item}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Who Should Attend */}
        <section className="mb-12 p-8 rounded-2xl shadow-xl" style={{ backgroundColor: "rgba(0, 0, 0, 0.8)", border: "2px solid #B88AFF" }}>
          <h2 className="text-3xl font-bold mb-6 pb-4 border-b-4" style={{ color: "#FFFFF0", borderColor: "#B88AFF" }}>
            Who Should Attend
          </h2>
          <div className="space-y-4">
            {(workshop.whoShouldAttend || []).map((item, index) => (
              <div key={index} className="p-4 rounded-lg" style={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}>
                <p className="text-lg" style={{ color: "#B88AFF" }}>
                  {item}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Prerequisites */}
        <section className="mb-12 p-8 rounded-2xl shadow-xl" style={{ backgroundColor: "rgba(0, 0, 0, 0.8)", border: "2px solid #B88AFF" }}>
          <h2 className="text-3xl font-bold mb-6 pb-4 border-b-4" style={{ color: "#FFFFF0", borderColor: "#B88AFF" }}>
            Prerequisites
          </h2>
          <div className="space-y-4">
            {(workshop.prerequisites || []).map((item, index) => (
              <div key={index} className="p-4 rounded-lg" style={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}>
                <p className="text-lg" style={{ color: "#B88AFF" }}>
                  {item}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Enrollment Button */}
        <div className="text-center">
          <Button
            onClick={handleEnrollClick}
            className="px-8 py-4 text-xl"
            style={{ backgroundColor: "#B88AFF", color: "#FFFFF0" }}
          >
            {user ? `Enroll in Workshop - ₹${workshop.price}` : "Login to Enroll"}
          </Button>
        </div>
      </main>

      {/* Enrollment Modal */}
      {showEnrollmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full border-2 border-purple-500">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold" style={{ color: "#FFFFF0" }}>
                Enroll in Workshop
              </h2>
              <button
                onClick={() => setShowEnrollmentModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-lg" style={{ color: "#B88AFF" }}>
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="mt-2"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", border: "1px solid #B88AFF", color: "#FFFFF0" }}
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-lg" style={{ color: "#B88AFF" }}>
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="mt-2"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", border: "1px solid #B88AFF", color: "#FFFFF0" }}
                />
              </div>
              <div>
                <Label htmlFor="mobile" className="text-lg" style={{ color: "#B88AFF" }}>
                  Mobile Number
                </Label>
                <Input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  required
                  className="mt-2"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", border: "1px solid #B88AFF", color: "#FFFFF0" }}
                />
              </div>
              
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-sm" style={{ color: "#B88AFF" }}>
                  <strong>Workshop:</strong> {workshop.title}
                </p>
                <p className="text-sm" style={{ color: "#B88AFF" }}>
                  <strong>Price:</strong> {workshop.price}
                </p>
              </div>
              
              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isProcessingPayment}
                  style={{ backgroundColor: "#B88AFF", color: "#FFFFF0" }}
                >
                  {isProcessingPayment ? "Processing Payment..." : `Pay ${workshop.price}`}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowEnrollmentModal(false)}
                  disabled={isProcessingPayment}
                  style={{ borderColor: "#B88AFF", color: "#B88AFF" }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
