import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Category API
export const categoryAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Failed to fetch categories');
    }
  },
  
  getById: async (id) => {
    try {
      const response = await api.get(`/categories/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Failed to fetch category');
    }
  },
  
  create: async (categoryData) => {
    try {
      const response = await api.post('/categories', categoryData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Failed to create category');
    }
  },
  
  update: async (id, categoryData) => {
    try {
      const response = await api.put(`/categories/${id}`, categoryData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Failed to update category');
    }
  },
  
  delete: async (id) => {
    try {
      const response = await api.delete(`/categories/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Failed to delete category');
    }
  }
};

// Product API
export const productAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/products');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Failed to fetch products');
    }
  },
  
  getById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Failed to fetch product');
    }
  },
  
  create: async (productData) => {
    try {
      // Use FormData for file uploads
      const formData = new FormData();
      
      // Append all text fields
      Object.keys(productData).forEach(key => {
        if (key !== 'images') {
          formData.append(key, productData[key]);
        }
      });
      
      // Append images if any
      if (productData.images && productData.images.length) {
        for (let i = 0; i < productData.images.length; i++) {
          formData.append('images', productData.images[i]);
        }
      }
      
      const response = await axios.post(`${API_URL}/products`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Failed to create product');
    }
  },
  
  update: async (id, productData) => {
    try {
      // Use FormData for file uploads
      const formData = new FormData();
      
      // Append all text fields
      Object.keys(productData).forEach(key => {
        if (key !== 'images') {
          formData.append(key, productData[key]);
        }
      });
      
      // Append images if any
      if (productData.images && productData.images.length) {
        for (let i = 0; i < productData.images.length; i++) {
          formData.append('images', productData.images[i]);
        }
      }
      
      // Flag to keep existing images
      if (productData.keepExistingImages) {
        formData.append('keepExistingImages', 'true');
      }
      
      const response = await axios.put(`${API_URL}/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Failed to update product');
    }
  },
  
  delete: async (id) => {
    try {
      const response = await api.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Failed to delete product');
    }
  }
};

export default api; 