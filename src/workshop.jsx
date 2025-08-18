"use client"
import React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "./components/ui2/button"
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui2/card"
import { Input } from "./components/ui2/input"
import { Label } from "./components/ui2/label"
import { Phone, Mail, MapPin, Linkedin, Youtube, Instagram } from "lucide-react"
import Navbar from "./components/navbar"

const workshops = [
  {
    id: 1,
    title: "Certified Ethical Hacker (CEH)",
    instructor: "Instructor- VHASS SOFTWARES PRIVATE LIMITED",
    duration: "Duration- 28 Hours",
    price: "₹25000",
    image: "/images/circuit-board.png",
  },
  {
    id: 2,
    title: "Awareness of Cyber Crime And Threats",
    instructor: "Instructor- VHASS SOFTWARES PRIVATE LIMITED",
    duration: "Duration- 20 Hours",
    price: "₹1000",
    image: "/images/robot-desk.png",
  },
  {
    id: 3,
    title: "Cyber Suraksha – 30-Day Cybersecurity Empowerment for Small Businesses",
    instructor: "Instructor- VHASS SOFTWARES PRIVATE LIMITED",
    duration: "Duration- 45 Hours",
    price: "₹8000",
    image: "/images/business-gears.png",
  },
  {
    id: 4,
    title: "Zero to Founder (Entrepreneurship Edition - Full Course For beginners)",
    instructor: "Instructor- VHASS SOFTWARES PRIVATE LIMITED",
    duration: "Duration- 40 Hours",
    price: "₹12999",
    image: "/images/entrepreneurship.png",
  },
]

export default function VHASSWorkshopsPage() {
  const navigate = useNavigate()
  const [showViewDetails, setShowViewDetails] = useState({})
  const [showEnrollNow, setShowEnrollNow] = useState(null)
  const [showEnrollmentForm, setShowEnrollmentForm] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
  })

  useEffect(() => {
    // Show view details for all workshops after 2 seconds
    const timer = setTimeout(() => {
      const viewDetailsState = {}
              workshops.forEach((workshop) => {
        viewDetailsState[workshop.id] = true
      })
      setShowViewDetails(viewDetailsState)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const handleViewDetails = (workshopId) => {
    // Show Enroll Now button for this workshop
    setShowEnrollNow(workshopId)
  }

  const handleEnrollNow = (workshopId) => {
    setShowEnrollmentForm(workshopId)
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    alert("Enrollment form submitted! Proceeding to payment...")
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
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div
          className="text-center mb-16 py-20 rounded-3xl shadow-2xl relative overflow-hidden"
          style={{ backgroundColor: "#000000" }}
        >
          <div className="absolute inset-0 opacity-10" style={{ backgroundColor: "#B88AFF" }}></div>
          <div className="relative z-10">
            <h1 className="text-5xl md:text-7xl font-bold mb-6" style={{ color: "#FFFFF0" }}>
              Explore Our Workshops
            </h1>
            <p className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed" style={{ color: "#B88AFF" }}>
              Learn from industry experts and gain hands-on experience with our comprehensive cybersecurity workshops
            </p>
            <div className="mt-8">
              <div
                className="inline-block px-8 py-3 rounded-full text-lg font-semibold"
                style={{ backgroundColor: "#B88AFF", color: "#000000" }}
              >
                🚀 Transform Your Career Today
              </div>
            </div>
          </div>
        </div>

        {/* Workshop Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {workshops.map((workshop, index) => (
            <Card
              key={workshop.id}
              className="group hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl border-0 overflow-hidden"
              style={{ backgroundColor: "#FFFFFF" }}
            >
              <div className="relative">
                <img
                  src={workshop.image || "/placeholder.svg"}
                  alt={workshop.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div
                  className="absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-bold"
                  style={{ backgroundColor: "#B88AFF", color: "#000000" }}
                >
                  Popular
                </div>
              </div>

              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold leading-tight" style={{ color: "#000000" }}>
                  {workshop.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-3 mb-6">
                  <p className="text-sm" style={{ color: "#666666" }}>
                    {workshop.instructor}
                  </p>
                  <p className="text-sm" style={{ color: "#666666" }}>
                    {workshop.duration}
                  </p>
                  <p className="text-3xl font-bold" style={{ color: "#B88AFF" }}>
                    {workshop.price}
                  </p>
                </div>

                {showViewDetails[workshop.id] && (
                  <Button
                    onClick={() => {
                      const slug = workshop.title
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/(^-|-$)/g, "")
                      navigate(`/workshop/${slug}`)
                    }}
                    className="w-full text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-all duration-200 transform hover:scale-105"
                    style={{ backgroundColor: "#000000" }}
                  >
                    View Workshop Details
                  </Button>
                )}

                {showEnrollmentForm === workshop.id && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div
                      className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl border-4"
                      style={{ borderColor: "#B88AFF" }}
                    >
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-bold" style={{ color: "#000000" }}>
                          Enrollment Form
                        </h3>
                        <button
                          onClick={() => setShowEnrollmentForm(null)}
                          className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                        >
                          ×
                        </button>
                      </div>
                      <form onSubmit={handleFormSubmit} className="space-y-6">
                        <div>
                          <Label htmlFor="name" className="text-lg font-semibold" style={{ color: "#000000" }}>
                            Name
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="mt-2 border-2 rounded-lg px-4 py-3 w-full text-lg focus:ring-2"
                            style={{ borderColor: "#B88AFF", backgroundColor: "#FFFFF0" }}
                            placeholder="Enter your full name"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email" className="text-lg font-semibold" style={{ color: "#000000" }}>
                            Email
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="mt-2 border-2 rounded-lg px-4 py-3 w-full text-lg focus:ring-2"
                            style={{ borderColor: "#B88AFF", backgroundColor: "#FFFFF0" }}
                            placeholder="Enter your email"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="mobile" className="text-lg font-semibold" style={{ color: "#000000" }}>
                            Mobile Number
                          </Label>
                          <Input
                            id="mobile"
                            name="mobile"
                            type="tel"
                            value={formData.mobile}
                            onChange={handleInputChange}
                            className="mt-2 border-2 rounded-lg px-4 py-3 w-full text-lg focus:ring-2"
                            style={{ borderColor: "#B88AFF", backgroundColor: "#FFFFF0" }}
                            placeholder="Enter your mobile number"
                            required
                          />
                        </div>
                        <Button
                          type="submit"
                          className="w-full text-white py-4 rounded-lg font-bold text-lg hover:opacity-90 transition-all duration-200 transform hover:scale-105"
                          style={{ backgroundColor: "#000000" }}
                        >
                          Proceed to Pay 💳
                        </Button>
                      </form>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action Section */}
        <div className="text-center mt-20">
          <div className="inline-block px-12 py-6 rounded-2xl shadow-xl" style={{ backgroundColor: "#B88AFF" }}>
            <h2 className="text-3xl font-bold mb-4" style={{ color: "#000000" }}>
              Ready to Start Your Journey?
            </h2>
            <p className="text-lg mb-6" style={{ color: "#000000" }}>
              Join thousands of students who have transformed their careers with VHASS
            </p>
            <Button
              className="px-8 py-3 text-lg font-bold rounded-lg hover:opacity-90 transition-all duration-200 transform hover:scale-105"
              style={{ backgroundColor: "#000000", color: "#FFFFF0" }}
            >
              Get Started Today 🎯
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-white mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Description */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <img src="/images/vhass-logo-new.jpeg" alt="VHASS Logo" className="w-8 h-8" />
                <span className="text-2xl font-bold">VHASS</span>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Empowering the digital world with cutting-edge cybersecurity education and solutions.
              </p>
            </div>

            {/* Quick Links and Workshops */}
            <div className="md:col-span-2">
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-3 mb-6">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors block text-sm">
                    › Home
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors block text-sm">
                    › Workshops
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors block text-sm">
                    › Workshops
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors block text-sm">
                    › About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors block text-sm">
                    › Support
                  </a>
                </li>
              </ul>
              
              <h4 className="text-lg font-semibold mb-4">Our Workshops</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors block text-sm">
                    › Ethical Hacking
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors block text-sm">
                    › Bug Bounty
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors block text-sm">
                    › Cyber Awareness
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors block text-sm">
                    › Teen Security
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors block text-sm">
                    › Entrepreneurship
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Us */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                  <div className="text-gray-300 text-sm">
                    <p>#2-1-70, Brilliants School Area,</p>
                    <p>Ibrahimpatnam, Krishna - 521 456,</p>
                    <p>Andhra Pradesh, India</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-300 text-sm">+91 8985820226</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-300 text-sm">info@vhass.in</span>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media and Copyright */}
          <div className="border-t border-gray-700 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
                <div className="flex space-x-4">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <Linkedin className="w-5 h-5 text-slate-800" />
                  </div>
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <Youtube className="w-5 h-5 text-slate-800" />
                  </div>
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <Instagram className="w-5 h-5 text-slate-800" />
                  </div>
                </div>
              </div>
              <div className="text-center md:text-right">
                <p className="text-gray-400 text-sm">© 2025 VHASS Softwares Pvt. Ltd. All rights reserved.</p>
                <div className="flex flex-wrap justify-center md:justify-end space-x-4 mt-2 text-sm">
                  <a href="#" className="text-gray-400 hover:text-white">
                    Terms & Conditions
                  </a>
                  <span className="text-gray-600">|</span>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Refund Policy
                  </a>
                  <span className="text-gray-600">|</span>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Privacy Policy
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
} 