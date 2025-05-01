import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const initialFormData = {
    name: '',
    email: '',
    gender: '',
    dob: '',
    address: '',
    phone: '',
    password: '',
    retypePassword: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const navigate = useNavigate();

  // Validation functions
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
  const validatePhone = (phone) => /^\d{10}$/.test(phone);
  const validateName = (name) => /^[a-zA-Z\s]{2,}$/.test(name);
  const validateAddress = (address) => address.trim().length >= 10;

  const validateForm = () => {
    let tempErrors = {};
    if (!formData.name) tempErrors.name = 'Name is required';
    else if (!validateName(formData.name)) tempErrors.name = 'Name must be at least 2 characters and letters only';
    
    if (!formData.email) tempErrors.email = 'Email is required';
    else if (!validateEmail(formData.email)) tempErrors.email = 'Invalid email format';
    
    if (!formData.gender) tempErrors.gender = 'Gender is required';
    
    if (!formData.dob) tempErrors.dob = 'Date of birth is required';
    else if (new Date(formData.dob) > new Date()) tempErrors.dob = 'Date of birth cannot be in future';
    else if (new Date().getFullYear() - new Date(formData.dob).getFullYear() < 18) tempErrors.dob = 'Must be at least 18 years old';
    
    if (!formData.address) tempErrors.address = 'Address is required';
    else if (!validateAddress(formData.address)) tempErrors.address = 'Address must be at least 10 characters';
    
    if (!formData.phone) tempErrors.phone = 'Phone number is required';
    else if (!validatePhone(formData.phone)) tempErrors.phone = 'Phone must be 10 digits';
    
    if (!formData.password) tempErrors.password = 'Password is required';
    else if (!validatePassword(formData.password)) tempErrors.password = 'Password must be 8+ characters with uppercase, lowercase, number, and special character';
    
    if (!formData.retypePassword) tempErrors.retypePassword = 'Please confirm password';
    else if (formData.password !== formData.retypePassword) tempErrors.retypePassword = 'Passwords do not match';

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

    console.log('Sending registration data:', formData);

    setIsSubmitting(true);
    try {
      const response = await axios.post('http://localhost:5000/api/register', formData);
      if (response.status === 201) {
        setShowSuccessPopup(true);
        setTimeout(() => {
          setShowSuccessPopup(false);
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      if (error.response?.status === 409) {
        setErrors({ ...errors, email: error.response.data.message });
      } else if (error.response?.status === 400) {
        setErrors({ ...errors, form: error.response.data.message });
      } else {
        setErrors({ ...errors, form: `Registration failed: ${error.response?.data.message || 'Please try again.'}` });
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
        maxWidth: '800px', // Increased to accommodate two-column layout
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
            <p style={{ fontSize: '18px' }}>Registration successful. Redirecting to login...</p>
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

        <form onSubmit={handleSubmit} style={{
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
          }}>Create Account</h2>

          {/* Row 1: Name + Email */}
          <div style={{ display: 'flex', gap: '20px', marginBottom: '25px' }}>
            <div style={{ flex: 1 }}>
              <label htmlFor="name" style={{ display: 'block', marginBottom: '8px', color: '#00b7eb', fontWeight: '600' }}>Full Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="Enter your full name"
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  border: '2px solid #ffd700', 
                  borderRadius: '8px', 
                  fontSize: '16px', 
                  transition: 'all 0.3s', 
                  background: 'rgba(255,255,255,0.8)',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
                  boxSizing: 'border-box'
                }} 
              />
              {errors.name && <span style={{ color: '#ff4500', fontSize: '13px', marginTop: '6px', display: 'block' }}>{errors.name}</span>}
            </div>

            <div style={{ flex: 1 }}>
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
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
                  boxSizing: 'border-box'
                }} 
              />
              {errors.email && <span style={{ color: '#ff4500', fontSize: '13px', marginTop: '6px', display: 'block' }}>{errors.email}</span>}
            </div>
          </div>

          {/* Row 2: Gender + DOB */}
          <div style={{ display: 'flex', gap: '20px', marginBottom: '25px' }}>
            <div style={{ flex: 1 }}>
              <label htmlFor="gender" style={{ display: 'block', marginBottom: '8px', color: '#00b7eb', fontWeight: '600' }}>Gender</label>
              <select 
                id="gender" 
                name="gender" 
                value={formData.gender} 
                onChange={handleChange}
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  border: '2px solid #ffd700', 
                  borderRadius: '8px', 
                  fontSize: '16px', 
                  background: 'rgba(255,255,255,0.8)', 
                  color: '#2c3e50',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
                  boxSizing: 'border-box',
                  height: '44px' // Match input height
                }}
              >
               <option value="" disabled hidden>Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>

              </select>
              {errors.gender && <span style={{ color: '#ff4500', fontSize: '13px', marginTop: '6px', display: 'block' }}>{errors.gender}</span>}
            </div>

            <div style={{ flex: 1 }}>
              <label htmlFor="dob" style={{ display: 'block', marginBottom: '8px', color: '#00b7eb', fontWeight: '600' }}>Date of Birth</label>
              <input 
                type="date" 
                id="dob" 
                name="dob" 
                value={formData.dob} 
                onChange={handleChange}
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  border: '2px solid #ffd700', 
                  borderRadius: '8px', 
                  fontSize: '16px', 
                  background: 'rgba(255,255,255,0.8)',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
                  boxSizing: 'border-box'
                }} 
              />
              {errors.dob && <span style={{ color: '#ff4500', fontSize: '13px', marginTop: '6px', display: 'block' }}>{errors.dob}</span>}
            </div>
          </div>

          {/* Row 3: Address + Phone */}
          <div style={{ display: 'flex', gap: '20px', marginBottom: '25px' }}>
            <div style={{ flex: 1 }}>
              <label htmlFor="address" style={{ display: 'block', marginBottom: '8px', color: '#00b7eb', fontWeight: '600' }}>Address</label>
              <textarea 
                id="address" 
                name="address" 
                value={formData.address} 
                onChange={handleChange} 
                placeholder="Enter your address"
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  border: '2px solid #ffd700', 
                  borderRadius: '8px', 
                  fontSize: '16px', 
                  height: '44px', // Match input height
                  resize: 'none', // Prevent resizing
                  background: 'rgba(255,255,255,0.8)',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
                  boxSizing: 'border-box'
                }} 
              />
              {errors.address && <span style={{ color: '#ff4500', fontSize: '13px', marginTop: '6px', display: 'block' }}>{errors.address}</span>}
            </div>

            <div style={{ flex: 1 }}>
              <label htmlFor="phone" style={{ display: 'block', marginBottom: '8px', color: '#00b7eb', fontWeight: '600' }}>Phone Number</label>
              <input 
                type="tel" 
                id="phone" 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange} 
                placeholder="Enter your phone number"
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  border: '2px solid #ffd700', 
                  borderRadius: '8px', 
                  fontSize: '16px', 
                  transition: 'all 0.3s', 
                  background: 'rgba(255,255,255,0.8)',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
                  boxSizing: 'border-box'
                }} 
              />
              {errors.phone && <span style={{ color: '#ff4500', fontSize: '13px', marginTop: '6px', display: 'block' }}>{errors.phone}</span>}
            </div>
          </div>

          {/* Row 4: Password + Confirm Password */}
          <div style={{ display: 'flex', gap: '20px', marginBottom: '25px' }}>
            <div style={{ flex: 1 }}>
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
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
                  boxSizing: 'border-box'
                }} 
              />
              {errors.password && <span style={{ color: '#ff4500', fontSize: '13px', marginTop: '6px', display: 'block' }}>{errors.password}</span>}
            </div>

            <div style={{ flex: 1 }}>
              <label htmlFor="retypePassword" style={{ display: 'block', marginBottom: '8px', color: '#00b7eb', fontWeight: '600' }}>Confirm Password</label>
              <input 
                type="password" 
                id="retypePassword" 
                name="retypePassword" 
                value={formData.retypePassword} 
                onChange={handleChange} 
                placeholder="Confirm your password"
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  border: '2px solid #ffd700', 
                  borderRadius: '8px', 
                  fontSize: '16px', 
                  transition: 'all 0.3s', 
                  background: 'rgba(255,255,255,0.8)',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
                  boxSizing: 'border-box'
                }} 
              />
              {errors.retypePassword && <span style={{ color: '#ff4500', fontSize: '13px', marginTop: '6px', display: 'block' }}>{errors.retypePassword}</span>}
            </div>
          </div>

          {errors.form && <div style={{ color: '#ff4500', textAlign: 'center', marginBottom: '20px', fontWeight: '600', fontSize: '14px' }}>{errors.form}</div>}

          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <button 
              type="submit" 
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
              {isSubmitting ? 'Registering...' : 'Register'}
            </button>

            <button 
              type="button" 
              onClick={handleReset} 
              style={{
                padding: '14px 30px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                background: 'linear-gradient(45deg, #ffd700, #ff4500)',
                color: 'white',
                transition: 'all 0.3s',
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                fontWeight: '600'
              }}
            >
              Reset
            </button>
          </div>

          <div style={{ 
            textAlign: 'center', 
            marginTop: '20px', 
            fontSize: '14px',
            color: '#00b7eb'
          }}>
            <a href="/login" style={{ 
              color: '#ff1493', 
              textDecoration: 'none',
              fontWeight: '600'
            }}>
              Already have an account? Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;