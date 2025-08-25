import React, { createContext, useContext, useState, useEffect } from 'react';
import ApiService from '../services/api.js';

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

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      checkAuthStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const checkAuthStatus = async () => {
    const now = Date.now();
    if (now - lastCheck < 1000) return;
    setLastCheck(now);

    try {
      const response = await ApiService.getProfile();
      if (response.user) {
        setUser(response.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.log('User not authenticated:', error.message);
      setUser(null);
      if (error.message !== 'Authentication required') {
        console.error('Auth check error:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      let response;

      if (credentials.googleId) {
        response = await ApiService.googleLogin(credentials);
      } else {
        response = await ApiService.login(credentials);
      }

      if (response.success) {
        setUser(response.user);

        // ✅ Save token after login
        if (response.token) {
          localStorage.setItem('auth_token', response.token);
        }

        return { success: true };
      }

      return { success: false, error: response.message || 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await ApiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('auth_token'); // ✅ clear token
      sessionStorage.removeItem('auth_token');
    }
  };

  const register = async (userData) => {
    try {
      await ApiService.register(userData);
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
