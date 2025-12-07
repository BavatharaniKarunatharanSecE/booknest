import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    // Get userId and email from localStorage or location state
    const savedUserId = localStorage.getItem('otpUserId');
    const savedEmail = localStorage.getItem('otpEmail') || (location.state?.email || '');
    
    if (!savedUserId || !savedEmail) {
      navigate('/login');
      return;
    }
    
    setUserId(savedUserId);
    setEmail(savedEmail);
    startResendCooldown();
  }, [location, navigate]);

  const startResendCooldown = () => {
    setResendCooldown(30);
    const interval = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Only allow numbers
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      setMessage('Please enter the complete 6-digit OTP');
      return;
    }
    
    setLoading(true);
    setMessage('');
    
    try {
      const response = await authAPI.verifyOTP(userId, otpCode);
      
      if (response.data.success) {
        // Login user with tokens
        login(response.data.data.accessToken, response.data.data.user);
        
        // Clear OTP data from localStorage
        localStorage.removeItem('otpUserId');
        localStorage.removeItem('otpEmail');
        
        // Navigate to home
        navigate('/');
      }
    } catch (error) {
      setMessage(error.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;
    
    setLoading(true);
    setMessage('');
    
    try {
      // Re-send login request to get new OTP
      const response = await authAPI.login(email, 'password-placeholder'); // You'll need to handle this differently
      
      if (response.data.success) {
        setMessage('New OTP sent to your email');
        setOtp(['', '', '', '', '', '']);
        startResendCooldown();
        document.getElementById('otp-0').focus();
      }
    } catch (error) {
      setMessage('Failed to resend OTP. Please try logging in again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Verify OTP</h2>
        <p>Enter the 6-digit code sent to {email}</p>
        
        {message && (
          <div className={`auth-message ${message.includes('failed') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="otp-container">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="otp-input"
                autoFocus={index === 0}
              />
            ))}
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary auth-btn"
            disabled={loading || otp.join('').length !== 6}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
        
        <div className="otp-actions">
          <p>
            Didn't receive the code?{' '}
            <button 
              type="button" 
              onClick={handleResendOTP}
              className="resend-link"
              disabled={resendCooldown > 0 || loading}
            >
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
            </button>
          </p>
          <button 
            type="button" 
            onClick={() => navigate('/login')}
            className="btn btn-link"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;