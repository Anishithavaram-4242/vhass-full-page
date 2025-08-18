import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastCheck, setLastCheck] = useState(0);

  // Check if user is logged in on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Add event listener for storage changes (in case of multiple tabs)
  useEffect(() => {
    const handleStorageChange = () => {
      checkAuthStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const checkAuthStatus = async () => {
    // Debounce auth checks to prevent too many API calls
    const now = Date.now();
    if (now - lastCheck < 1000) { // Only check once per second
      return;
    }
    setLastCheck(now);

    try {
      const response = await apiService.getProfile();
      if (response.user) {
        setUser(response.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.log('User not authenticated:', error.message);
      setUser(null);
      // Don't show error for 401 responses as they're expected for unauthenticated users
      if (error.message !== 'Authentication required') {
        console.error('Auth check error:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      // Check if this is a Google login (has googleId)
      if (credentials.googleId) {
        // Handle Google login
        const response = await apiService.googleLogin(credentials);
        if (response.success) {
          setUser(response.user);
          setTimeout(() => checkAuthStatus(), 100);
          return { success: true };
        }
      } else {
        // Handle regular email/password login
        const response = await apiService.login(credentials);
        if (response.success) {
          setUser(response.user);
          setTimeout(() => checkAuthStatus(), 100);
          return { success: true };
        }
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
      setUser(null);
      // Clear any stored auth data
      localStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_token');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear local state
      setUser(null);
    }
  };

  const register = async (userData) => {
    try {
      await apiService.register(userData);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
