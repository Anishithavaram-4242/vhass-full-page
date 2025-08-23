import Footer from "./Components/footer"
import React from "react"
import { useNavigate } from "react-router-dom"  
import Navbar from "./Components/navbar"
export default function EntrepreneurshipPage() {
  return (
    <div>
      <Navbar />
    <div
      className="min-h-screen bg-gray-900 text-white"
      style={{
        backgroundImage: "url(/images/constellation-bg.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900/90 to-blue-800/90 py-20 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Entrepreneurship Program</h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Turn your idea into a successful business with our comprehensive entrepreneur program designed for aspiring
            security professionals.
          </p>
          <button className="bg-white text-blue-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
            Apply Now
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-800/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Idea Incubation */}
            <div className="bg-gray-700 p-6 rounded-lg text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-3 text-white">Idea Incubation</h3>
              <p className="text-gray-300 text-sm">
                Get expert assistance to refine your business idea and develop a viable product or service.
              </p>
            </div>

            {/* Business Training */}
            <div className="bg-gray-700 p-6 rounded-lg text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-3 text-white">Business Training</h3>
              <p className="text-gray-300 text-sm">
                Gain essential business skills including marketing, finance, and operations specifically for industry
                ventures.
              </p>
            </div>

            {/* Mentorship */}
            <div className="bg-gray-700 p-6 rounded-lg text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-3 text-white">Mentorship</h3>
              <p className="text-gray-300 text-sm">
                Connect with successful entrepreneurs and industry experts for personalized guidance.
              </p>
            </div>

            {/* Investor Network */}
            <div className="bg-gray-700 p-6 rounded-lg text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-3 text-white">Investor Network</h3>
              <p className="text-gray-300 text-sm">
                Access a network of investors interested in funding promising startups.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Program Structure */}
      <section className="py-16 bg-gray-900/90 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Program Structure</h2>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-green-500"></div>

            {/* Module 1 */}
            <div className="relative flex items-center mb-12">
              <div className="flex-1 pr-8">
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <h3 className="text-lg font-semibold text-green-400 mb-3">Module 1: Foundation</h3>
                  <ul className="text-gray-300 space-y-1 text-sm">
                    <li>• Business fundamentals for entrepreneurs</li>
                    <li>• Market research and validation</li>
                    <li>• Developing your unique value proposition</li>
                  </ul>
                </div>
              </div>
              <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-green-500 rounded-full border-4 border-gray-900"></div>
              <div className="flex-1 pl-8"></div>
            </div>

            {/* Module 2 */}
            <div className="relative flex items-center mb-12">
              <div className="flex-1 pr-8"></div>
              <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-green-500 rounded-full border-4 border-gray-900"></div>
              <div className="flex-1 pl-8">
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <h3 className="text-lg font-semibold text-green-400 mb-3">Module 2: Product Development</h3>
                  <ul className="text-gray-300 space-y-1 text-sm">
                    <li>• Product/service development strategies</li>
                    <li>• Prototyping and testing</li>
                    <li>• Intellectual property protection</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Module 3 */}
            <div className="relative flex items-center mb-12">
              <div className="flex-1 pr-8">
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <h3 className="text-lg font-semibold text-green-400 mb-3">Module 3: Growth & Operations</h3>
                  <ul className="text-gray-300 space-y-1 text-sm">
                    <li>• Marketing and sales for security services</li>
                    <li>• Financial management and funding</li>
                    <li>• Building your team and culture</li>
                  </ul>
                </div>
              </div>
              <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-green-500 rounded-full border-4 border-gray-900"></div>
              <div className="flex-1 pl-8"></div>
            </div>

            {/* Module 4 */}
            <div className="relative flex items-center">
              <div className="flex-1 pr-8"></div>
              <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-green-500 rounded-full border-4 border-gray-900"></div>
              <div className="flex-1 pl-8">
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <h3 className="text-lg font-semibold text-green-400 mb-3">Module 4: Launch & Beyond</h3>
                  <ul className="text-gray-300 space-y-1 text-sm">
                    <li>• Preparing for investor pitches</li>
                    <li>• Legal and compliance considerations</li>
                    <li>• Graduation and demo day</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-900/90 to-blue-800/90 py-16 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4 text-white">Ready to Launch Your Venture?</h2>
          <p className="text-blue-100 mb-8">Applications for our next cohort are now open. Limited spots available.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
              Apply Now
            </button>
            <button className="border border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-900 transition-colors">
              Program Details
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
    </div>
  )
}