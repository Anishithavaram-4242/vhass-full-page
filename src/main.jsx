import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { GoogleOAuthProvider } from "@react-oauth/google"
import Home from "./Home"
import HelpDeskPage from "./Pages/FAQ"
 // ✅ Make sure the path is correct and matches your file structure
import "./index.css"
import AuthPage from "./auth"
import AboutUs from "./aboutus"
import CybersecurityPage from "./Cybersecuritypage"
import EntrepreneurPage from "./entrepreneur.jsx"
import VHASSCoursesPage from "./page.jsx"
import VHASSWorkshopsPage from "./workshop.jsx"
import Dashboard from "./Pages/Dashboard.jsx"
import { AuthProvider } from "./context/AuthContext.jsx"
import CourseDetailPage from "./Components/CourseDetail/CourseDetailPage.jsx"
import WorkshopDetailPage from "./Components/WorkshopDetail/WorkshopDetailPage.jsx"
import PaymentCallback from "./Components/PaymentCallback.jsx"
import PhonePeTest from "./Components/PhonePeTest.jsx"
import PhonePeDebug from "./Components/PhonePeDebug.jsx"
import AdminDashboard from "./Components/AdminDashboard.jsx"
import Policies from "./Components/Policies.jsx"
import { GOOGLE_CLIENT_ID } from "./config/googleConfig.js"

const root = ReactDOM.createRoot(document.getElementById("root"))

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/helpdesk" element={<HelpDeskPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/services" element={<CybersecurityPage />} />
            <Route path="/Entrepreneur" element={<EntrepreneurPage />} />
            <Route path="/course" element={<VHASSCoursesPage />} />
                              <Route path="/course/:slug" element={<CourseDetailPage />} />
                    <Route path="/workshop" element={<VHASSWorkshopsPage />} />
                    <Route path="/workshop/:slug" element={<WorkshopDetailPage />} />
                    <Route path="/payment/callback" element={<PaymentCallback />} />
                    <Route path="/phonepe-test" element={<PhonePeTest />} />
                    <Route path="/phonepe-debug" element={<PhonePeDebug />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/policies" element={<Policies />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
)
