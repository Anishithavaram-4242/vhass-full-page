const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Debug logging
console.log('🔍 API Configuration:');
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('API_BASE_URL:', API_BASE_URL);
console.log('Environment:', import.meta.env.MODE);

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    console.log('🚀 ApiService initialized with baseURL:', this.baseURL);
  }

  // Helper method to make API calls
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    console.log('🌐 Making API request to:', url);
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Include cookies for session management
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      // Handle 401 Unauthorized specifically
      if (response.status === 401) {
        // Clear any stored auth data
        localStorage.removeItem('auth_token');
        sessionStorage.removeItem('auth_token');
        throw new Error('Authentication required');
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Authentication APIs
  async register(userData) {
    return this.makeRequest('/user/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    return this.makeRequest('/user/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async googleLogin(googleData) {
    return this.makeRequest('/user/google-login', {
      method: 'POST',
      body: JSON.stringify(googleData),
    });
  }

  async logout() {
    return this.makeRequest('/user/logout', {
      method: 'POST',
    });
  }

  async verifyUser(token) {
    return this.makeRequest('/user/verify', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  async forgotPassword(email) {
    return this.makeRequest('/user/forgot', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token, newPassword) {
    return this.makeRequest('/user/reset', {
      method: 'POST',
      body: JSON.stringify({ token, password: newPassword }),
    });
  }

  async getProfile() {
    return this.makeRequest('/user/me');
  }

  async updateProfile(profileData) {
    return this.makeRequest('/user/update', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Course APIs
  async getAllCourses() {
    return this.makeRequest('/course/all');
  }

  async getCourse(courseId) {
    return this.makeRequest(`/course/${courseId}`);
  }

  async getMyCourses() {
    return this.makeRequest('/mycourse');
  }

  async getUserCourses() {
    return this.makeRequest('/user/courses');
  }

  async getLectures(courseId) {
    return this.makeRequest(`/lectures/${courseId}`);
  }

  async getLecture(lectureId) {
    return this.makeRequest(`/lecture/${lectureId}`);
  }

  async addProgress(progressData) {
    return this.makeRequest('/user/progress', {
      method: 'POST',
      body: JSON.stringify(progressData),
    });
  }

  async getProgress() {
    return this.makeRequest('/user/progress');
  }

  // Workshop APIs
  async getAllWorkshops() {
    return this.makeRequest('/workshop/all');
  }

  async getWorkshop(workshopId) {
    return this.makeRequest(`/workshop/${workshopId}`);
  }

  async getMyWorkshops() {
    return this.makeRequest('/myworkshop');
  }

  async getUserWorkshops() {
    return this.makeRequest('/user/workshops');
  }

  async getEnrollmentHistory() {
    return this.makeRequest('/user/enrollments');
  }

  // Contact
  async sendContactMessage(payload) {
    return this.makeRequest('/contact', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Payment APIs
  async phonepeCheckout(type, id) {
    const endpoint = type === 'course' ? `/course/phonepe/checkout/${id}` : `/workshop/phonepe/checkout/${id}`;
    return this.makeRequest(endpoint, {
      method: 'POST',
    });
  }

  async phonepeStatus(type, transactionId) {
    const endpoint = type === 'course' ? `/course/phonepe/status/${transactionId}` : `/workshop/phonepe/status/${transactionId}`;
    return this.makeRequest(endpoint, {
      method: 'POST',
    });
  }

  // Google OAuth
  getGoogleAuthUrl() {
    // Use API base and append /auth/google so it hits /api/auth/google
    return `${API_BASE_URL}/auth/google`;
  }

  // Health check
  async healthCheck() {
    return this.makeRequest('/health');
  }

  // Admin APIs
  async getAdminStats() {
    return this.makeRequest('/admin/stats');
  }

  async getAllUsers() {
    return this.makeRequest('/admin/users');
  }

  async getAllCourses() {
    return this.makeRequest('/admin/courses');
  }

  async getAllWorkshops() {
    return this.makeRequest('/admin/workshops');
  }

  async createCourse(courseData) {
    return this.makeRequest('/admin/course', {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
  }

  async updateCourse(courseId, courseData) {
    return this.makeRequest(`/admin/course/${courseId}`, {
      method: 'PUT',
      body: JSON.stringify(courseData),
    });
  }

  async deleteCourse(courseId) {
    return this.makeRequest(`/admin/course/${courseId}`, {
      method: 'DELETE',
    });
  }

  async createWorkshop(workshopData) {
    return this.makeRequest('/admin/workshop', {
      method: 'POST',
      body: JSON.stringify(workshopData),
    });
  }

  async updateWorkshop(workshopId, workshopData) {
    return this.makeRequest(`/admin/workshop/${workshopId}`, {
      method: 'PUT',
      body: JSON.stringify(workshopData),
    });
  }

  async deleteWorkshop(workshopId) {
    return this.makeRequest(`/admin/workshop/${workshopId}`, {
      method: 'DELETE',
    });
  }

  async updateUserRole(userId, role) {
    return this.makeRequest(`/admin/user/${userId}`, {
      method: 'PUT',
      body: JSON.stringify({ id: userId, role }),
    });
  }

  async deleteUser(userId) {
    return this.makeRequest(`/admin/user/${userId}`, {
      method: 'DELETE',
    });
  }

  async getUserDetails(userId) {
    return this.makeRequest(`/admin/user/${userId}`);
  }
}

export default new ApiService();
