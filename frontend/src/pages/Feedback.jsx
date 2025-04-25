import React, { useState } from 'react';
import axios from 'axios';

const Feedback = () => {
  const [formData, setFormData] = useState({
    type: 'Feedback',
    name: '',
    email: '',
    subject: '',
    message: '',
    rating: 5,
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    rating: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const handleRatingChange = (rating) => {
    setFormData({
      ...formData,
      rating: rating,
    });
    if (errors.rating) setErrors({ ...errors, rating: '' });
  };

  // Form validation
  const validate = () => {
    let tempErrors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      tempErrors.name = 'Please enter your name';
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      tempErrors.email = 'Please provide a valid email address';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      tempErrors.email = 'Invalid email format';
      isValid = false;
    }

    if (!formData.subject.trim()) {
      tempErrors.subject = 'Please specify a subject';
      isValid = false;
    }

    if (!formData.message.trim()) {
      tempErrors.message = 'Please write your message';
      isValid = false;
    }

    if (formData.type === 'Feedback') {
      if (formData.rating < 1 || formData.rating > 5) {
        tempErrors.rating = 'Rating must be between 1 and 5';
        isValid = false;
      }
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/feedback/create', formData);
      alert('Feedback submitted successfully!');
      setFormData({ type: 'Feedback', name: '', email: '', subject: '', message: '', rating: 5 });
    } catch (error) {
      alert('Error submitting feedback.');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backgroundImage:
          'url("https://images.pexels.com/photos/319912/pexels-photo-319912.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div
        style={{
          maxWidth: '600px',
          width: '100%',
          margin: '20px',
          position: 'relative',
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            padding: '40px',
            borderRadius: '10px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          {/* Star Rating Graphic */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '20px',
            }}
          >
            <div
              style={{
                backgroundColor: '#f4e5c2',
                borderRadius: '15px',
                padding: '10px 20px',
                display: 'inline-flex',
                alignItems: 'center',
                position: 'relative',
              }}
            >
              <span style={{ fontSize: '24px', color: '#f5c518' }}>
                ★★★★★
              </span>
              {/* Speech bubble tail */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '0',
                  height: '0',
                  borderLeft: '10px solid transparent',
                  borderRight: '10px solid transparent',
                  borderTop: '10px solid #f4e5c2',
                }}
              />
            </div>
          </div>

          {/* Form Title */}
          <h2
            style={{
              textAlign: 'center',
              marginBottom: '10px',
              color: '#333',
              fontSize: '28px',
              fontWeight: '700',
              textTransform: 'uppercase',
            }}
          >
            Submit Feedback
          </h2>

          {/* Description Text */}
          <p
            style={{
              textAlign: 'center',
              marginBottom: '30px',
              color: '#666',
              fontSize: '14px',
            }}
          >
            Please share your feedback or inquiry with us. Your input helps us improve our services.
          </p>

          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="type"
              style={{
                display: 'block',
                marginBottom: '8px',
                color: '#333',
                fontWeight: '600',
                fontSize: '14px',
              }}
            >
              Type of Request
            </label>
            <div
              style={{
                display: 'flex',
                gap: '20px',
                justifyContent: 'center',
              }}
            >
              <label style={{ display: 'flex', alignItems: 'center', color: '#333' }}>
                <input
                  type="radio"
                  name="type"
                  value="Feedback"
                  checked={formData.type === 'Feedback'}
                  onChange={handleChange}
                  style={{ marginRight: '8px' }}
                />
                Feedback
              </label>
              <label style={{ display: 'flex', alignItems: 'center', color: '#333' }}>
                <input
                  type="radio"
                  name="type"
                  value="Inquiry"
                  checked={formData.type === 'Inquiry'}
                  onChange={handleChange}
                  style={{ marginRight: '8px' }}
                />
                Inquiry
              </label>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="name"
              style={{
                display: 'block',
                marginBottom: '8px',
                color: '#333',
                fontWeight: '600',
                fontSize: '14px',
              }}
            >
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
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                fontSize: '14px',
                transition: 'border-color 0.3s',
                background: '#fff',
              }}
            />
            {errors.name && (
              <span
                style={{
                  color: '#ff4757',
                  fontSize: '12px',
                  marginTop: '5px',
                  display: 'block',
                }}
              >
                {errors.name}
              </span>
            )}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="email"
              style={{
                display: 'block',
                marginBottom: '8px',
                color: '#333',
                fontWeight: '600',
                fontSize: '14px',
              }}
            >
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
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                fontSize: '14px',
                transition: 'border-color 0.3s',
                background: '#fff',
              }}
            />
            {errors.email && (
              <span
                style={{
                  color: '#ff4757',
                  fontSize: '12px',
                  marginTop: '5px',
                  display: 'block',
                }}
              >
                {errors.email}
              </span>
            )}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="subject"
              style={{
                display: 'block',
                marginBottom: '8px',
                color: '#333',
                fontWeight: '600',
                fontSize: '14px',
              }}
            >
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="The subject of your request"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                fontSize: '14px',
                transition: 'border-color 0.3s',
                background: '#fff',
              }}
            />
            {errors.subject && (
              <span
                style={{
                  color: '#ff4757',
                  fontSize: '12px',
                  marginTop: '5px',
                  display: 'block',
                }}
              >
                {errors.subject}
              </span>
            )}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="message"
              style={{
                display: 'block',
                marginBottom: '8px',
                color: '#333',
                fontWeight: '600',
                fontSize: '14px',
              }}
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Write your message here"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                fontSize: '14px',
                minHeight: '100px',
                resize: 'vertical',
                background: '#fff',
              }}
            />
            {errors.message && (
              <span
                style={{
                  color: '#ff4757',
                  fontSize: '12px',
                  marginTop: '5px',
                  display: 'block',
                }}
              >
                {errors.message}
              </span>
            )}
          </div>

          {formData.type === 'Feedback' && (
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#333',
                  fontWeight: '600',
                  fontSize: '14px',
                }}
              >
                How Would You Rate Our Product?
              </label>
              <div style={{ display: 'flex', gap: '5px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => handleRatingChange(star)}
                    style={{
                      fontSize: '24px',
                      cursor: 'pointer',
                      color: star <= formData.rating ? '#f5c518' : '#ccc',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = '#f5c518';
                      let prevSibling = e.target.previousSibling;
                      while (prevSibling) {
                        prevSibling.style.color = '#f5c518';
                        prevSibling = prevSibling.previousSibling;
                      }
                    }}
                    onMouseLeave={(e) => {
                      const stars = e.target.parentElement.children;
                      for (let i = 0; i < stars.length; i++) {
                        stars[i].style.color = i < formData.rating ? '#f5c518' : '#ccc';
                      }
                    }}
                  >
                    {star <= formData.rating ? '★' : '☆'}
                  </span>
                ))}
              </div>
              {errors.rating && (
                <span
                  style={{
                    color: '#ff4757',
                    fontSize: '12px',
                    marginTop: '5px',
                    display: 'block',
                  }}
                >
                  {errors.rating}
                </span>
              )}
            </div>
          )}

          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <button
              type="submit"
              style={{
                padding: '12px 30px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
                backgroundColor: '#333',
                color: 'white',
                transition: 'background-color 0.3s',
                fontWeight: '600',
              }}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Feedback;