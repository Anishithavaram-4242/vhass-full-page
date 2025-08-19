"use client"
import React from "react"
import api from "../services/api"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import Navbar from "../Components/navbar";
import "../App.css"

export default function HelpDeskPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("All")
  const [expandedFAQ, setExpandedFAQ] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const faqs = [
    {
      id: 1,
      question: "What courses do you offer?",
      answer:
        "We offer comprehensive cybersecurity courses including Ethical Hacking, Bounty Hunting, Cyber Crime Awareness, and Cyber Security for Beginners.",
      category: "Courses",
    },
    {
      id: 2,
      question: "How long are the courses?",
      answer:
        "Course duration varies from 4 weeks to 12 weeks depending on the complexity and depth of the subject matter.",
      category: "Courses",
    },
    {
      id: 3,
      question: "Do you provide certification?",
      answer: "Yes, we provide industry-recognized certifications upon successful completion of our courses.",
      category: "Certification",
    },
    {
      id: 4,
      question: "What are the payment options?",
      answer: "We accept various payment methods including credit cards, debit cards, UPI, and bank transfers.",
      category: "Payment",
    },
  ]

  const toggleFAQ = (id) => {
    setExpandedFAQ(expandedFAQ === id ? null : id)
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const [sending, setSending] = useState(false)
  const [status, setStatus] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus("")
    setSending(true)
    try {
      await api.sendContactMessage(formData)
      setStatus("Message sent successfully.")
      setFormData({ name: "", email: "", message: "" })
    } catch (err) {
      setStatus(err?.message || "Failed to send message")
    } finally {
      setSending(false)
    }
  }

  return (
   <div className="min-h-screen text-white relative z-10">

      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
Frequently Asked Questions</h1>
         <p className="text-gray-300">
            Find answers to common questions about our courses, workshops, and cybersecurity training programs.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center gap-4 mb-12">
          {["All", "Courses", "Certification", "Payment"].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                activeFilter === filter
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto mb-16">
          {faqs.map((faq) => (
            <div key={faq.id} className="bg-white border border-gray-200 rounded-lg mb-4 overflow-hidden">
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-800">{faq.question}</span>
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform ${expandedFAQ === faq.id ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedFAQ === faq.id && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Still have questions */}
          <div className="bg-blue-600 text-white p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
            <p className="mb-6">
              If you couldn't find the answer to your question, please don't hesitate to contact our support team.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span>info@vhass.in</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span>+91 8985820226</span>
              </div>
            </div>
          </div>

          {/* Send us a message */}
          <div className="bg-white p-8 rounded-lg border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Send us a message</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Your email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Your question"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              {status && (
                <div className="text-sm text-gray-600">{status}</div>
              )}
              <button
                type="submit"
                disabled={sending}
                className="w-full bg-blue-600 disabled:opacity-60 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                {sending ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src="/VHASS.png" alt="VHASS Logo" className="w-12 h-12" />
                <h3 className="text-xl font-bold">VHASS</h3>
              </div>
              <p className="text-gray-300 text-sm">
                Empowering the digital world with cutting-edge cybersecurity education and solutions.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/" className="text-gray-300 hover:text-white transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/courses" className="text-gray-300 hover:text-white transition-colors">
                    Courses
                  </a>
                </li>
                <li>
                  <a href="/workshop" className="text-gray-300 hover:text-white transition-colors">
                    WorkShop
                  </a>
                </li>
                <li>
                  <a href="/entrepreneur" className="text-gray-300 hover:text-white transition-colors">
                    Entrepreneur
                  </a>
                </li>
                <li>
                  <a href="/about" className="text-gray-300 hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="/helpdesk" className="text-gray-300 hover:text-white transition-colors">
                    HelpDesk
                  </a>
                </li>
              </ul>
            </div>

            {/* Courses */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Courses</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">
                    Ethical Hacking
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">
                    Bounty Hunting
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">
                    Awareness of Cyber Crime
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">
                    Cyber Security for Beginners
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">
                    Entrepreneurship for Beginners
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Us */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <p>92-1-70, Brillanta School Area,</p>
                <p>Ibrahimpatnam Krishna - 521 456</p>
                <p>Andhra Pradesh</p>
                <p className="flex items-center gap-2 mt-3">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  +91 8985820226
                </p>
                <p className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  info@vhass.in
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
