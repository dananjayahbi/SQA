import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const initialFormData = {
    email: '',
    password: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const navigate = useNavigate();

  // Validation functions
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.length >= 8;

  const validateForm = () => {
    let tempErrors = {};
    if (!formData.email) tempErrors.email = 'Email is required';
    else if (!validateEmail(formData.email)) tempErrors.email = 'Invalid email format';
    
    if (!formData.password) tempErrors.password = 'Password is required';
    else if (!validatePassword(formData.password)) tempErrors.password = 'Password must be at least 8 characters';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await axios.post('http://localhost:5000/api/login', formData);
      if (response.status === 200) {
        setShowSuccessPopup(true);
        setTimeout(() => {
          setShowSuccessPopup(false);
          navigate('/dashboard');
        }, 2000);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setErrors({ ...errors, form: error.response.data.message });
      } else {
        setErrors({ ...errors, form: 'Login failed. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setErrors({});
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: 'url("https://images.unsplash.com/photo-1556742524-750f5ab715fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(45deg, rgba(255,105,180,0.3), rgba(0,191,255,0.3), rgba(255,215,0,0.3))',
        zIndex: 1
      }} />
      
      <div style={{
        maxWidth: '400px',
        width: '100%',
        margin: '20px',
        position: 'relative',
        zIndex: 2
      }}>
        {showSuccessPopup && (
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'linear-gradient(135deg, #ff69b4, #00b7eb)',
            padding: '40px',
            borderRadius: '20px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
            color: '#fff',
            textAlign: 'center',
            zIndex: 1000,
            animation: 'popupFade 0.5s ease-in',
            border: '2px solid #fff'
          }}>
            <h2 style={{ marginBottom: '20px', fontSize: '28px', textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>Success!</h2>
            <p style={{ fontSize: '18px' }}>Login successful. Redirecting...</p>
          </div>
        )}

        {showSuccessPopup && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.6)',
            zIndex: 999
          }} />
        )}

        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '40px',
          borderRadius: '15px',
          boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
          border: '1px solid rgba(255,255,255,0.3)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            width: '100px',
            height: '100px',
            background: 'radial-gradient(circle, rgba(255,105,180,0.4), transparent)',
            borderRadius: '50%'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-20px',
            left: '-20px',
            width: '100px',
            height: '100px',
            background: 'radial-gradient(circle, rgba(0,191,255,0.4), transparent)',
            borderRadius: '50%'
          }} />

          <h2 style={{
            textAlign: 'center',
            marginBottom: '30px',
            color: '#ff1493',
            fontSize: '32px',
            fontWeight: '700',
            textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
          }}>Login</h2>

          <div style={{ marginBottom: '25px' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '8px', color: '#00b7eb', fontWeight: '600' }}>Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              placeholder="Enter your email"
              style={{ 
                width: '100%', 
                padding: '12px', 
                border: '2px solid #ffd700', 
                borderRadius: '8px', 
                fontSize: '16px', 
                transition: 'all 0.3s', 
                background: 'rgba(255,255,255,0.8)',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
              }} 
            />
            {errors.email && <span style={{ color: '#ff4500', fontSize: '13px', marginTop: '6px', display: 'block' }}>{errors.email}</span>}
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '8px', color: '#00b7eb', fontWeight: '600' }}>Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              placeholder="Enter your password"
              style={{ 
                width: '100%', 
                padding: '12px', 
                border: '2px solid #ffd700', 
                borderRadius: '8px', 
                fontSize: '16px', 
                transition: 'all 0.3s', 
                background: 'rgba(255,255,255,0.8)',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
              }} 
            />
            {errors.password && <span style={{ color: '#ff4500', fontSize: '13px', marginTop: '6px', display: 'block' }}>{errors.password}</span>}
          </div>

          {errors.form && <div style={{ color: '#ff4500', textAlign: 'center', marginBottom: '20px', fontWeight: '600', fontSize: '14px' }}>{errors.form}</div>}

          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <button 
              type="submit" 
              onClick={handleSubmit}
              disabled={isSubmitting} 
              style={{
                padding: '14px 30px',
                border: 'none',
                borderRadius: '8px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                background: 'linear-gradient(45deg, #ff69b4, #00b7eb)',
                color: 'white',
                opacity: isSubmitting ? '0.6' : '1',
                transition: 'all 0.3s',
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                fontWeight: '600'
              }}
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>

           
          </div>

          <div style={{ 
            textAlign: 'center', 
            marginTop: '20px', 
            fontSize: '14px',
            color: '#00b7eb'
          }}>
            <a href="/register" style={{ 
              color: '#ff1493', 
              textDecoration: 'none',
              fontWeight: '600'
            }}>
              Create an Account
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;