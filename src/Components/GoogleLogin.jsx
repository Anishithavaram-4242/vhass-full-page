import React from 'react';
import { GoogleLogin as GoogleLoginButton } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api.js';

export default function GoogleLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      // Decode the JWT token to get user info
      const decoded = JSON.parse(atob(credentialResponse.credential.split('.')[1]));
      
      // Extract user information from Google response
      const userData = {
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture,
        googleId: decoded.sub,
        email_verified: decoded.email_verified
      };

      // Call the login function from AuthContext
      await login(userData);
      
      // Redirect to dashboard after successful login
      navigate('/dashboard');
    } catch (error) {
      console.error('Google login error:', error);
      alert('Google login failed. Please try again.');
    }
  };

  const handleGoogleError = () => {
    console.error('Google login failed');
    alert('Google login failed. Please try again.');
  };

  return (
    <div className="google-login-container">
      {import.meta.env.MODE === 'production' && (
        <GoogleLoginButton
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          useOneTap
          theme="filled_black"
          size="large"
          text="continue_with"
          shape="rectangular"
          width={400}
          locale="en"
        />
      )}
      {/* Fallback: redirect-based OAuth if One Tap origin configuration blocks */}
      <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center' }}>
        <button
          type="button"
          onClick={() => {
            window.location.href = apiService.getGoogleAuthUrl();
          }}
          style={{
            border: '1px solid #e5e7eb',
            padding: '10px 16px',
            borderRadius: 8,
            background: '#fff',
            cursor: 'pointer'
          }}
        >
          Continue with Google (fallback)
        </button>
      </div>
    </div>
  );
}
