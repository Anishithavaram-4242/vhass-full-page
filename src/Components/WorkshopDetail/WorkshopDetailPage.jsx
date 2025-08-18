"use client"

import React, { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "../../components/ui2/button"
import { Input } from "../../components/ui2/input"
import { Label } from "../../components/ui2/label"
import { Phone, Mail, MapPin, Linkedin, Youtube, Instagram, ArrowLeft, X } from "lucide-react"
import Navbar from "../../components/navbar"
import { useAuth } from "../../context/AuthContext.jsx"
import phonepeService from "../../services/phonepeService.js"

const workshopData = {
  "certified-ethical-hacker-ceh": {
    id: 1,
    title: "Certified Ethical Hacker (CEH)",
    instructor: "Instructor: VHASS SOFTWARES PRIVATE LIMITED",
    duration: "Duration: 28 hours",
    price: "₹25000",
    image: "/images/circuit-board.png",
    about: "The Certified Ethical Hacker (CEH) workshop provides hands-on training in ethical hacking techniques. Learn to identify vulnerabilities, perform penetration testing, and secure systems against cyber threats.",
    syllabus: [
      "Introduction to Ethical Hacking",
      "Footprinting and Reconnaissance",
      "Scanning Networks",
      "Enumeration",
      "Vulnerability Analysis",
      "Malware Threats",
      "Hacking Web Applications"
    ],
    whoShouldAttend: [
      "Security Officers",
      "Auditors",
      "Security Professionals",
      "Network Administrators",
      "IT professionals preparing for CEH certification"
    ],
    prerequisites: [
      "Basic computer knowledge",
      "Understanding of networking concepts",
      "Laptop with i5 processor and 8GB RAM"
    ],
  },
  "awareness-of-cyber-crime-and-threats": {
    id: 2,
    title: "Awareness of Cyber Crime And Threats",
    instructor: "Instructor: VHASS SOFTWARES PRIVATE LIMITED",
    duration: "Duration: 20 hours",
    price: "₹1000",
    image: "/images/robot-desk.png",
    about: "This workshop provides essential knowledge about cyber threats and how to protect yourself and your organization from cyber attacks.",
    syllabus: [
      "Understanding Cyber Crime",
      "Phishing & Social Engineering",
      "Malware Threats",
      "Online Financial Safety",
      "Social Media & Privacy",
      "Workplace Security"
    ],
    whoShouldAttend: [
      "Individual internet users",
      "Employees in any industry",
      "Small business owners",
      "Students and community leaders"
    ],
    prerequisites: [
      "No technical knowledge required",
      "Basic computer/phone usage skills",
      "Interest in staying safe online"
    ],
  },
  "cyber-suraksha-30-day-cybersecurity-empowerment-for-small-businesses": {
    id: 3,
    title: "Cyber Suraksha – 30-Day Cybersecurity Empowerment for Small Businesses",
    instructor: "Instructor: VHASS SOFTWARES PRIVATE LIMITED",
    duration: "Duration: 45 hours",
    price: "₹8000",
    image: "/images/business-gears.png",
    about: "A comprehensive 30-day program designed to empower small businesses with practical cybersecurity knowledge and tools.",
    syllabus: [
      "Week 1: Basics & Awareness",
      "Week 2: Threat Prevention",
      "Week 3: Business-Level Security",
      "Week 4: Recovery, Tools & Certification"
    ],
    whoShouldAttend: [
      "Small business owners",
      "Managers and staff",
      "Finance and HR teams",
      "Anyone supporting digital businesses"
    ],
    prerequisites: [
      "No technical background required",
      "Basic computer skills",
      "Stable internet connection",
      "Access to laptop or desktop"
    ],
  },
  "zero-to-founder-entrepreneurship-edition-full-course-for-beginners": {
    id: 4,
    title: "Zero to Founder (Entrepreneurship Edition - Full Course For beginners)",
    instructor: "Instructor: VHASS SOFTWARES PRIVATE LIMITED",
    duration: "Duration: 40 hours",
    price: "₹12999",
    image: "/images/entrepreneurship.png",
    about: "A practical workshop designed to guide you from idea to launch. Learn entrepreneurship fundamentals and build real startups with confidence.",
    syllabus: [
      "Foundation of Entrepreneurship",
      "Startup Ideation & Validation",
      "Building the Team & MVP",
      "Fundraising & Revenue Models",
      "Marketing & Launching",
      "Scaling Your Startup",
      "Legal, Ethics & Culture"
    ],
    whoShouldAttend: [
      "Students curious about startups",
      "Aspiring entrepreneurs",
      "Techies/Developers",
      "Designers/Creators",
      "Hackathon Participants"
    ],
    prerequisites: [
      "Curiosity to learn",
      "Basic digital skills",
      "Smartphone or laptop",
      "1 hour/day commitment"
    ],
  },
}

export default function WorkshopDetailsPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    mobile: user?.phone || "",
  })

  const workshop = workshopData[slug]

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
              src={workshop.image || "/placeholder.svg"}
              alt={workshop.title}
              className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-xl"
            />
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 text-lg">
            <span style={{ color: "#B88AFF" }}>{workshop.instructor}</span>
            <span style={{ color: "#B88AFF" }}>{workshop.duration}</span>
            <span className="text-3xl font-bold" style={{ color: "#FFFFF0" }}>
              {workshop.price}
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
            {workshop.syllabus.map((item, index) => (
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
            {workshop.whoShouldAttend.map((item, index) => (
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
            {workshop.prerequisites.map((item, index) => (
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
            {user ? `Enroll in Workshop - ${workshop.price}` : "Login to Enroll"}
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
