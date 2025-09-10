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
      const profile = await ApiService.getProfile();
      setUser(profile?.user || profile || null);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = credentials.googleId
        ? await ApiService.googleLogin(credentials)
        : await ApiService.login(credentials);

      if (response?.token) {
        localStorage.setItem('auth_token', response.token);
        const profile = await ApiService.getProfile();
        setUser(profile?.user || profile || null);
        return { success: true };
      }

      return { success: false, error: response?.message || 'Login failed' };
    } catch (error) {
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
      const response = await ApiService.register(userData);
      if (response?.token) {
        localStorage.setItem('auth_token', response.token);
        const profile = await ApiService.getProfile();
        setUser(profile?.user || profile || null);
        return { success: true };
      }
      return { success: false, error: response?.message || 'Signup failed' };
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
