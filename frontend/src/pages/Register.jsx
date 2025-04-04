import React, { useState } from 'react';
import axios from 'axios';

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

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const validateForm = () => {
    let tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = 'Name is required';
    if (!formData.email) tempErrors.email = 'Email is required';
    else if (!validateEmail(formData.email)) tempErrors.email = 'Invalid email format';
    if (!formData.gender) tempErrors.gender = 'Gender is required';
    if (!formData.dob) tempErrors.dob = 'Date of birth is required';
    else if (new Date(formData.dob) > new Date()) tempErrors.dob = 'Date of birth cannot be in the future';
    if (!formData.address.trim()) tempErrors.address = 'Address is required';
    if (!formData.phone) tempErrors.phone = 'Phone number is required';
    else if (!validatePhone(formData.phone)) tempErrors.phone = 'Phone number must be 10 digits';
    if (!formData.password) tempErrors.password = 'Password is required';
    else if (!validatePassword(formData.password)) tempErrors.password = 'Password must be at least 8 characters with uppercase, lowercase, number, and special character';
    if (!formData.retypePassword) tempErrors.retypePassword = 'Please confirm your password';
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

    setIsSubmitting(true);
    try {
      const response = await axios.post('http://localhost:5000/api/register/create', formData);
      if (response.status === 201) window.location.href = '/dashboard';
    } catch (error) {
      if (error.response?.status === 409) {
        setErrors({ ...errors, email: 'Email already exists' });
      } else {
        setErrors({ ...errors, form: 'Registration failed. Please try again.' });
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
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px'
    }}>
      <form 
        onSubmit={handleSubmit}
        style={{
          background: '#fff',
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
        }}
      >
        <h2 style={{
          textAlign: 'center',
          marginBottom: '20px',
          color: '#333'
        }}>Register</h2>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="name" style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
          {errors.name && <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px', display: 'block' }}>
            {errors.name}
          </span>}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
          {errors.email && <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px', display: 'block' }}>
            {errors.email}
          </span>}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="gender" style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px', display: 'block' }}>
            {errors.gender}
          </span>}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="dob" style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
            Date of Birth
          </label>
          <input
            type="date"
            id="dob"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
          {errors.dob && <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px', display: 'block' }}>
            {errors.dob}
          </span>}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="address" style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
            Address
          </label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter your address"
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              minHeight: '80px',
              resize: 'vertical'
            }}
          />
          {errors.address && <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px', display: 'block' }}>
            {errors.address}
          </span>}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="phone" style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
          {errors.phone && <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px', display: 'block' }}>
            {errors.phone}
          </span>}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
          {errors.password && <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px', display: 'block' }}>
            {errors.password}
          </span>}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="retypePassword" style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
            Confirm Password
          </label>
          <input
            type="password"
            id="retypePassword"
            name="retypePassword"
            value={formData.retypePassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
          {errors.retypePassword && <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px', display: 'block' }}>
            {errors.retypePassword}
          </span>}
        </div>

        {errors.form && <div style={{
          color: '#dc3545',
          textAlign: 'center',
          marginBottom: '15px'
        }}>{errors.form}</div>}

        <div style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'center'
        }}>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              background: '#007bff',
              color: 'white',
              opacity: isSubmitting ? '0.6' : '1',
              ':hover': !isSubmitting && { opacity: '0.9' }
            }}
          >
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>

          <button
            type="button"
            onClick={handleReset}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              background: '#6c757d',
              color: 'white',
              ':hover': { opacity: '0.9' }
            }}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;