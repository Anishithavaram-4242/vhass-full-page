import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Navbar from "../Components/navbar";
import Footer from "../Components/footer";
import ApiService from "../services/api.js";
import "./Dashboard.css";

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

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Profile editing state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || ""
  });

  // Data state
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [registeredWorkshops, setRegisteredWorkshops] = useState([]);
  const [enrollmentHistory, setEnrollmentHistory] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    loadDashboardData();
  }, [user, navigate]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load user's registered courses
      const coursesResponse = await ApiService.getUserCourses();
      setRegisteredCourses(coursesResponse.courses || []);

      // Load user's registered workshops
      const workshopsResponse = await ApiService.getUserWorkshops();
      setRegisteredWorkshops(workshopsResponse.workshops || []);

      // Load enrollment history
      const historyResponse = await ApiService.getEnrollmentHistory();
      setEnrollmentHistory(historyResponse.history || []);

    } catch (error) {
      console.error("Error loading dashboard data:", error);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await ApiService.updateProfile(profileData);
      if (response.success) {
        setSuccess("Profile updated successfully!");
        setIsEditingProfile(false);
        // Refresh user data
        window.location.reload();
      } else {
        setError(response.message || "Failed to update profile");
      }
    } catch (error) {
      setError(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'text-green-500';
      case 'in progress': return 'text-yellow-500';
      case 'upcoming': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="dashboard-container">
      <Navbar />
      
      <main className="dashboard-main">
        <div className="dashboard-header">
          <div className="welcome-section">
            <h1 className="welcome-title">Welcome back, {user.name}!</h1>
            <p className="welcome-subtitle">Manage your courses, workshops, and profile</p>
          </div>
          
                     <div className="profile-card">
             <div className="profile-avatar">
               <span>{user.name?.charAt(0).toUpperCase()}</span>
             </div>
             <div className="profile-info">
               <h3>{user.name}</h3>
               <p>{user.email}</p>
               {user.phone && <p>{user.phone}</p>}
             </div>
             <div className="profile-actions">
               <button 
                 className="edit-profile-btn"
                 onClick={() => setIsEditingProfile(true)}
               >
                 Edit Profile
               </button>
               <button 
                 className="logout-btn"
                 onClick={handleLogout}
               >
                 Logout
               </button>
             </div>
           </div>
        </div>

        {/* Profile Edit Modal */}
        {isEditingProfile && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Edit Profile</h2>
                <button 
                  className="close-btn"
                  onClick={() => setIsEditingProfile(false)}
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleProfileUpdate} className="profile-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                    className="disabled-input"
                  />
                  <small>Email cannot be changed</small>
                </div>
                
                <div className="form-actions">
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={() => setIsEditingProfile(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="save-btn"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Dashboard Tabs */}
        <div className="dashboard-tabs">
          <button 
            className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button 
            className={`tab-btn ${activeTab === "courses" ? "active" : ""}`}
            onClick={() => setActiveTab("courses")}
          >
            My Courses ({registeredCourses.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === "workshops" ? "active" : ""}`}
            onClick={() => setActiveTab("workshops")}
          >
            My Workshops ({registeredWorkshops.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === "history" ? "active" : ""}`}
            onClick={() => setActiveTab("history")}
          >
            Enrollment History
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {loading && (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading...</p>
            </div>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {success && (
            <div className="success-message">
              {success}
            </div>
          )}

          {/* Overview Tab */}
          {activeTab === "overview" && !loading && (
            <div className="overview-grid">
              <div className="stats-card">
                <h3>Total Courses</h3>
                <div className="stat-number">{registeredCourses.length}</div>
                <p>Enrolled courses</p>
              </div>
              
              <div className="stats-card">
                <h3>Total Workshops</h3>
                <div className="stat-number">{registeredWorkshops.length}</div>
                <p>Registered workshops</p>
              </div>
              
              <div className="stats-card">
                <h3>Completed</h3>
                <div className="stat-number">
                  {enrollmentHistory.filter(item => item.status === 'completed').length}
                </div>
                <p>Finished courses</p>
              </div>
              
              <div className="stats-card">
                <h3>In Progress</h3>
                <div className="stat-number">
                  {enrollmentHistory.filter(item => item.status === 'in progress').length}
                </div>
                <p>Active learning</p>
              </div>
            </div>
          )}

          {/* Courses Tab */}
          {activeTab === "courses" && !loading && (
            <div className="courses-grid">
              {registeredCourses.length === 0 ? (
                <div className="empty-state">
                  <h3>No courses enrolled yet</h3>
                  <p>Start your learning journey by enrolling in our courses!</p>
                  <button 
                    className="browse-btn"
                    onClick={() => navigate("/course")}
                  >
                    Browse Courses
                  </button>
                </div>
              ) : (
                registeredCourses.map((course) => (
                  <div key={course._id} className="course-card">
                    <div className="course-image">
                      <img src={getImageUrl(course.image)} alt={course.title} />
                    </div>
                    <div className="course-content">
                      <h3>{course.title}</h3>
                      <p>{course.description}</p>
                      <div className="course-meta">
                        <span className={`status ${getStatusColor(course.status)}`}>
                          {course.status || 'Enrolled'}
                        </span>
                        <span className="enrollment-date">
                          Enrolled: {formatDate(course.enrollmentDate)}
                        </span>
                      </div>
                      <button 
                        className="view-course-btn"
                        onClick={() => navigate(`/course/${course._id}`)}
                      >
                        Continue Learning
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Workshops Tab */}
          {activeTab === "workshops" && !loading && (
            <div className="workshops-grid">
              {registeredWorkshops.length === 0 ? (
                <div className="empty-state">
                  <h3>No workshops registered yet</h3>
                  <p>Join our interactive workshops to enhance your skills!</p>
                  <button 
                    className="browse-btn"
                    onClick={() => navigate("/workshop")}
                  >
                    Browse Workshops
                  </button>
                </div>
              ) : (
                registeredWorkshops.map((workshop) => (
                  <div key={workshop._id} className="workshop-card">
                    <div className="workshop-image">
                      <img src={getImageUrl(workshop.image)} alt={workshop.title} />
                    </div>
                    <div className="workshop-content">
                      <h3>{workshop.title}</h3>
                      <p>{workshop.description}</p>
                      <div className="workshop-meta">
                        <span className="date">
                          {formatDate(workshop.date)}
                        </span>
                        <span className="time">
                          {workshop.time}
                        </span>
                        <span className={`status ${getStatusColor(workshop.status)}`}>
                          {workshop.status || 'Registered'}
                        </span>
                      </div>
                      <button 
                        className="view-workshop-btn"
                        onClick={() => navigate(`/workshop/${workshop._id}`)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* History Tab */}
          {activeTab === "history" && !loading && (
            <div className="history-table">
              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Type</th>
                    <th>Enrollment Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {enrollmentHistory.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="empty-history">
                        No enrollment history found
                      </td>
                    </tr>
                  ) : (
                    enrollmentHistory.map((item) => (
                      <tr key={item._id}>
                        <td>{item.title}</td>
                        <td>
                          <span className={`type-badge ${item.type}`}>
                            {item.type}
                          </span>
                        </td>
                        <td>{formatDate(item.enrollmentDate)}</td>
                        <td>
                          <span className={`status-badge ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                        </td>
                        <td>
                          <button 
                            className="view-btn"
                            onClick={() => navigate(`/${item.type}/${item._id}`)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default Dashboard;
