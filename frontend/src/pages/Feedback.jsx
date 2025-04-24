import React, { useState } from 'react';
import { TextField, Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Typography, Box, FormHelperText } from '@mui/material';
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
  };

  // Form validation
  const validate = () => {
    let tempErrors = {};
    let isValid = true;

    // Name Validation
    if (!formData.name.trim()) {
      tempErrors.name = 'Please enter your name';
      isValid = false;
    }

    // Email Validation (simple regex for email format)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      tempErrors.email = 'Please provide a valid email address';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      tempErrors.email = 'Invalid email format';
      isValid = false;
    }

    // Subject Validation
    if (!formData.subject.trim()) {
      tempErrors.subject = 'Please specify a subject';
      isValid = false;
    }

    // Message Validation
    if (!formData.message.trim()) {
      tempErrors.message = 'Please write your message';
      isValid = false;
    }

    // Rating Validation (only if Feedback type is selected)
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

    // Perform validation
    if (!validate()) {
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/feedback/create', formData);
      alert("Feedback submitted successfully!"); 
      setFormData({ ...formData, name: '', email: '', subject: '', message: '', rating: 5 });
    } catch (error) {
      alert('Error submitting feedback.');
    }
  };

  return (
    <Box sx={{
      maxWidth: 600, 
      margin: 'auto', 
      padding: 3, 
      backgroundColor: '#ffffff', 
      borderRadius: '8px', 
      boxShadow: 3,
      backgroundImage: 'url(https://images.pexels.com/photos/8167109/pexels-photo-8167109.jpeg)', 
      backgroundSize: 'cover', 
      backgroundPosition: 'center',
    }}>
      <Typography variant="h4" gutterBottom sx={{
        textAlign: 'center',
        color: '#ffffff',
        fontWeight: 'bold',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)',
        marginBottom: 3,
      }}>
        Share Your Feedback or Inquiry
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <FormControl component="fieldset" sx={{ mb: 3 }}>
          <FormLabel component="legend" sx={{ fontWeight: 'bold', color: '#ffffff' }}>Type of Request</FormLabel>
          <RadioGroup
            row
            name="type"
            value={formData.type}
            onChange={handleChange}
            sx={{ justifyContent: 'center' }}
          >
            <FormControlLabel value="Feedback" control={<Radio />} label="Feedback" sx={{ color: '#ffffff' }} />
            <FormControlLabel value="Inquiry" control={<Radio />} label="Inquiry" sx={{ color: '#ffffff' }} />
          </RadioGroup>
        </FormControl>

        <TextField
          fullWidth
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          error={!!errors.name}
          helperText={errors.name}
          sx={{
            mb: 2,
            backgroundColor: '#ffffff',
            borderRadius: '4px',
            '& .MuiOutlinedInput-root': {
              borderRadius: '4px',
            },
          }}
          placeholder="Enter your name"
        />

        <TextField
          fullWidth
          label="Email Address"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          error={!!errors.email}
          helperText={errors.email}
          sx={{
            mb: 2,
            backgroundColor: '#ffffff',
            borderRadius: '4px',
            '& .MuiOutlinedInput-root': {
              borderRadius: '4px',
            },
          }}
          placeholder="Your email address"
        />

        <TextField
          fullWidth
          label="Subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          error={!!errors.subject}
          helperText={errors.subject}
          sx={{
            mb: 2,
            backgroundColor: '#ffffff',
            borderRadius: '4px',
            '& .MuiOutlinedInput-root': {
              borderRadius: '4px',
            },
          }}
          placeholder="The subject of your request"
        />

        <TextField
          fullWidth
          label="Message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          error={!!errors.message}
          helperText={errors.message}
          multiline
          rows={4}
          sx={{
            mb: 2,
            backgroundColor: '#ffffff',
            borderRadius: '4px',
            '& .MuiOutlinedInput-root': {
              borderRadius: '4px',
            },
          }}
          placeholder="Write your message here"
        />

        {formData.type === 'Feedback' && (
          <TextField
            fullWidth
            label="Rating (1-5)"
            name="rating"
            type="number"
            value={formData.rating}
            onChange={handleChange}
            inputProps={{ min: 1, max: 5 }}
            error={!!errors.rating}
            helperText={errors.rating}
            sx={{
              mb: 2,
              backgroundColor: '#ffffff',
              borderRadius: '4px',
              '& .MuiOutlinedInput-root': {
                borderRadius: '4px',
              },
            }}
            placeholder="Rate your experience"
          />
        )}

        <Button 
          variant="contained" 
          color="primary" 
          type="submit" 
          fullWidth
          sx={{
            mt: 3,
            padding: '12px',
            backgroundColor: '#3f51b5',
            '&:hover': {
              backgroundColor: '#303f9f',
            },
          }}
        >
          Submit Your Request
        </Button>
      </form>
    </Box>
  );
};

export default Feedback;
