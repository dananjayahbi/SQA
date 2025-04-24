import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormControlLabel,
  Switch,
  Grid,
  IconButton,
  Paper,
  Divider,
  Alert
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';
import { categoryAPI, productAPI } from '../utils/api';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const ProductForm = ({ product, onSubmitSuccess, onCancel }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [keepExistingImages, setKeepExistingImages] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: 0,
    isActive: true
  });

  const isEditMode = !!product;

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryAPI.getAll();
        setCategories(data);
      } catch (err) {
        setError('Failed to load categories');
        console.error(err);
      }
    };

    fetchCategories();
  }, []);

  // Populate form when in edit mode
  useEffect(() => {
    if (isEditMode && product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category?._id || product.category || '',
        stock: product.stock || 0,
        isActive: product.isActive !== undefined ? product.isActive : true
      });

      // Set existing product images for preview
      if (product.images && product.images.length > 0) {
        setPreviewImages(product.images.map(img => ({
          url: img.startsWith('http') ? img : `http://localhost:5000${img}`,
          isExisting: true,
          path: img
        })));
      }
    }
  }, [isEditMode, product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setImageFiles(prev => [...prev, ...selectedFiles]);
      
      // Create preview URLs
      const newPreviewImages = selectedFiles.map(file => ({
        url: URL.createObjectURL(file),
        isExisting: false
      }));
      
      setPreviewImages(prev => [...prev, ...newPreviewImages]);
    }
  };

  const handleRemoveImage = (index) => {
    const updatedPreviews = [...previewImages];
    const removedPreview = updatedPreviews[index];
    
    // Revoke object URL to prevent memory leaks
    if (!removedPreview.isExisting) {
      URL.revokeObjectURL(removedPreview.url);
    }
    
    updatedPreviews.splice(index, 1);
    setPreviewImages(updatedPreviews);
    
    // If it's a new image (not from the server), remove from imageFiles as well
    if (!removedPreview.isExisting) {
      const updatedImageFiles = [...imageFiles];
      updatedImageFiles.splice(index, 0); // This needs to be matched correctly with the preview index
      setImageFiles(updatedImageFiles);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Validate form
      if (!formData.name || !formData.price || !formData.category) {
        throw new Error('Please fill all required fields');
      }
      
      // Validate price as number
      if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) < 0) {
        throw new Error('Price must be a valid number');
      }
      
      // Prepare product data for submission
      const productToSubmit = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10) || 0,
        images: imageFiles,
        keepExistingImages: keepExistingImages
      };
      
      let result;
      if (isEditMode) {
        // Update existing product
        result = await productAPI.update(product._id, productToSubmit);
      } else {
        // Create new product
        result = await productAPI.create(productToSubmit);
      }
      
      // Clean up preview image URLs
      previewImages.forEach(img => {
        if (!img.isExisting) {
          URL.revokeObjectURL(img.url);
        }
      });
      
      // Call success callback with the result
      if (onSubmitSuccess) {
        onSubmitSuccess(result);
      }
    } catch (err) {
      setError(err.message || 'An error occurred while saving the product');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Grid container spacing={2} style={{display: "flex", flexDirection: "column"}}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            id="name"
            label="Product Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            id="price"
            label="Price"
            name="price"
            type="number"
            inputProps={{ min: 0, step: 0.01 }}
            value={formData.price}
            onChange={handleChange}
            margin="normal"
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              label="Category"
            >
              {categories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="stock"
            label="Stock"
            name="stock"
            type="number"
            inputProps={{ min: 0 }}
            value={formData.stock}
            onChange={handleChange}
            margin="normal"
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="description"
            label="Description"
            name="description"
            multiline
            rows={4}
            value={formData.description}
            onChange={handleChange}
            margin="normal"
          />
        </Grid>
        
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.isActive}
                onChange={handleChange}
                name="isActive"
                color="primary"
              />
            }
            label="Active Product"
          />
        </Grid>
      </Grid>
      
      <Divider sx={{ my: 3 }} />
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Product Images
        </Typography>
        
        {isEditMode && previewImages.some(img => img.isExisting) && (
          <FormControlLabel
            control={
              <Switch
                checked={keepExistingImages}
                onChange={(e) => setKeepExistingImages(e.target.checked)}
                name="keepExistingImages"
                color="primary"
              />
            }
            label="Keep existing images"
            sx={{ mb: 2 }}
          />
        )}
        
        <Button
          component="label"
          variant="contained"
          startIcon={<CloudUploadIcon />}
          sx={{ mb: 2 }}
        >
          Upload Images
          <VisuallyHiddenInput 
            type="file" 
            accept="image/*" 
            multiple 
            onChange={handleImageChange} 
          />
        </Button>
        
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {previewImages.map((image, index) => (
            <Grid item xs={6} sm={4} md={3} key={index}>
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 1, 
                  position: 'relative',
                  height: 150,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}
              >
                <img 
                  src={image.url} 
                  alt={`Preview ${index}`} 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '100%',
                    objectFit: 'contain'
                  }} 
                />
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 5,
                    right: 5,
                    bgcolor: 'rgba(255,255,255,0.8)',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.9)',
                    },
                  }}
                  size="small"
                  onClick={() => handleRemoveImage(index)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
        {onCancel && (
          <Button 
            variant="outlined" 
            onClick={onCancel} 
            disabled={loading}
          >
            Cancel
          </Button>
        )}
        <Button 
          type="submit" 
          variant="contained"
          disabled={loading}
        >
          {loading ? 'Saving...' : isEditMode ? 'Update Product' : 'Create Product'}
        </Button>
      </Box>
    </Box>
  );
};

export default ProductForm; 