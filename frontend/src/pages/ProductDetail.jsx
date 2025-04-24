import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Divider,
  Chip,
  Rating,
  Card,
  CardMedia,
  CardContent,
  Paper,
  TextField,
  Alert,
  IconButton,
  Breadcrumbs,
  Link,
  Skeleton,
  Tabs,
  Tab,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Snackbar,
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { productAPI } from '../utils/api';
import { useCart } from '../contexts/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { addToCart, stockExceededMessage } = useCart();
  
  // State
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  
  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');
      try {
        // In a real app, we would use the actual product ID
        // For now, we'll use a mock API call and return the first product
        const productsData = await productAPI.getAll();
        const fetchedProduct = productsData.find(p => p._id === id) || productsData[0];
        setProduct(fetchedProduct);
      } catch (err) {
        setError('Failed to load product details. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);
  
  // Handle quantity change
  const handleQuantityChange = (newValue) => {
    // Ensure quantity doesn't go below 1 or above stock
    const updatedQuantity = Math.max(1, Math.min(newValue, product?.stock || 1));
    setQuantity(updatedQuantity);
  };
  
  // Handle add to cart
  const handleAddToCart = () => {
    if (!product) return;
    
    // Create a product object with the selected quantity
    const productToAdd = { ...product };
    
    // Add to cart multiple times based on quantity
    let success = true;
    for (let i = 0; i < quantity; i++) {
      const added = addToCart(productToAdd);
      if (!added) {
        success = false;
        break;
      }
    }
    
    if (success) {
      setNotification({
        open: true,
        message: `${product.name} (${quantity}) added to cart!`,
        severity: 'success',
      });
    }
  };
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Handle notification close
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };
  
  // Helper function to get product image URL
  const getImageUrl = (product, index = 0) => {
    if (!product || !product.images || product.images.length === 0) {
      return 'https://via.placeholder.com/600x400?text=No+Image';
    }
    
    const image = product.images[index] || product.images[0];
    if (image.startsWith('http')) {
      return image;
    } else {
      return `http://localhost:5000${image}`;
    }
  };
  
  return (
    <Container sx={{ py: 4 }}>
      {/* Notifications */}
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity} 
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
      
      <Snackbar
        open={!!stockExceededMessage}
        autoHideDuration={3000}
        message={stockExceededMessage}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        ContentProps={{
          sx: { bgcolor: 'warning.main', color: 'warning.contrastText' }
        }}
      />
      
      {/* Back button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/store/products')}
        sx={{ mb: 2 }}
      >
        Back to Products
      </Button>
      
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link color="inherit" href="/store">Home</Link>
        <Link color="inherit" href="/store/products">Products</Link>
        <Typography color="text.primary">
          {loading ? <Skeleton width={100} /> : product?.name || 'Product Details'}
        </Typography>
      </Breadcrumbs>
      
      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} data-testid="product-error-alert">
          {error}
        </Alert>
      )}
      
      {/* Loading state or product details */}
      {loading ? (
        <Box>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
              <Box sx={{ display: 'flex', mt: 2, gap: 1 }}>
                {[1, 2, 3].map((_, index) => (
                  <Skeleton key={index} variant="rectangular" width={80} height={80} sx={{ borderRadius: 1 }} />
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Skeleton variant="text" height={60} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="40%" />
              <Skeleton variant="text" height={30} width="30%" sx={{ mt: 2 }} />
              <Skeleton variant="text" height={100} sx={{ mt: 2 }} />
              <Skeleton variant="rectangular" height={50} width="60%" sx={{ mt: 3, borderRadius: 1 }} />
            </Grid>
          </Grid>
        </Box>
      ) : product ? (
        <Box data-testid="product-detail-container">
          <Grid container spacing={4}>
            {/* Product Images */}
            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 2,
                  overflow: 'hidden',
                  border: '1px solid',
                  borderColor: 'divider',
                  position: 'relative',
                }}
              >
                <Box
                  component="img"
                  src={getImageUrl(product, selectedImage)}
                  alt={product.name}
                  sx={{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'contain',
                    aspectRatio: '4/3',
                    display: 'block',
                  }}
                  data-testid="product-detail-image"
                />
                
                {product.stock <= 5 && (
                  <Chip
                    label={product.stock === 0 ? 'Out of Stock' : `Only ${product.stock} left`}
                    color={product.stock === 0 ? 'error' : 'warning'}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      fontWeight: 500,
                    }}
                  />
                )}
              </Paper>
              
              {/* Thumbnail images */}
              <Box sx={{ display: 'flex', mt: 2, gap: 1 }}>
                {product.images && product.images.length > 0 ? (
                  product.images.map((image, index) => (
                    <Box
                      key={index}
                      component="img"
                      src={getImageUrl(product, index)}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      onClick={() => setSelectedImage(index)}
                      sx={{
                        width: 80,
                        height: 80,
                        objectFit: 'cover',
                        borderRadius: 1,
                        cursor: 'pointer',
                        border: selectedImage === index ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
                        '&:hover': {
                          transform: 'scale(1.05)',
                        },
                      }}
                    />
                  ))
                ) : (
                  <Box
                    component="img"
                    src="https://via.placeholder.com/80?text=No+Image"
                    alt="No thumbnail"
                    sx={{
                      width: 80,
                      height: 80,
                      objectFit: 'cover',
                      borderRadius: 1,
                    }}
                  />
                )}
              </Box>
            </Grid>
            
            {/* Product Info */}
            <Grid item xs={12} md={6}>
              <Typography 
                variant="h4" 
                component="h1" 
                fontWeight={600} 
                gutterBottom
                data-testid="product-detail-name"
              >
                {product.name}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Rating
                  value={4.5}
                  precision={0.5}
                  readOnly
                />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  (24 reviews)
                </Typography>
              </Box>
              
              <Typography 
                variant="h4" 
                color="primary" 
                fontWeight={700} 
                sx={{ mb: 2 }}
                data-testid="product-detail-price"
              >
                ${product.price?.toFixed(2)}
              </Typography>
              
              <Typography 
                variant="body1" 
                paragraph
                sx={{ mb: 3 }}
                data-testid="product-detail-description"
              >
                {product.description || 'No description available for this product.'}
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Category:
                </Typography>
                <Chip 
                  label={product.category?.name || 'Uncategorized'} 
                  size="small" 
                  sx={{ mr: 1 }} 
                  data-testid="product-detail-category"
                />
              </Box>
              
              <Divider sx={{ my: 3 }} />
              
              {/* Quantity selector */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Quantity:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton 
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1 || product.stock === 0}
                    data-testid="decrease-quantity-button"
                  >
                    <RemoveIcon />
                  </IconButton>
                  
                  <TextField
                    value={quantity}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value)) {
                        handleQuantityChange(value);
                      }
                    }}
                    inputProps={{ 
                      min: 1, 
                      max: product.stock, 
                      style: { textAlign: 'center' } 
                    }}
                    sx={{ width: 60, mx: 1 }}
                    disabled={product.stock === 0}
                    data-testid="quantity-input"
                  />
                  
                  <IconButton 
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= product.stock || product.stock === 0}
                    data-testid="increase-quantity-button"
                  >
                    <AddIcon />
                  </IconButton>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                    {product.stock} available
                  </Typography>
                </Box>
              </Box>
              
              {/* Add to cart button */}
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<AddShoppingCartIcon />}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                fullWidth
                sx={{ mb: 2, py: 1.5 }}
                data-testid="add-to-cart-button"
              >
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
              
              {/* Action buttons */}
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button 
                  variant="outlined" 
                  startIcon={<FavoriteIcon />}
                  sx={{ flex: 1 }}
                >
                  Wishlist
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<ShareIcon />}
                  sx={{ flex: 1 }}
                >
                  Share
                </Button>
              </Box>
            </Grid>
          </Grid>
          
          {/* Tabs section */}
          <Box sx={{ mt: 6 }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              sx={{ 
                borderBottom: 1, 
                borderColor: 'divider',
                mb: 3,
              }}
            >
              <Tab label="Description" id="tab-0" aria-controls="tabpanel-0" />
              <Tab label="Specifications" id="tab-1" aria-controls="tabpanel-1" />
              <Tab label="Reviews" id="tab-2" aria-controls="tabpanel-2" />
            </Tabs>
            
            <Box role="tabpanel" hidden={tabValue !== 0} id="tabpanel-0" aria-labelledby="tab-0">
              {tabValue === 0 && (
                <Box sx={{ p: 3 }}>
                  <Typography variant="body1" paragraph>
                    {product.description || 'No detailed description available for this product.'}
                  </Typography>
                  <Typography variant="body1">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla non facilisis metus, non molestie nisl. 
                    Etiam eu orci eu ante porttitor fermentum. Donec in tellus tristique, dapibus ante eu, tempor nisi. 
                    Integer in magna vestibulum, aliquet eros in, convallis metus.
                  </Typography>
                </Box>
              )}
            </Box>
            
            <Box role="tabpanel" hidden={tabValue !== 1} id="tabpanel-1" aria-labelledby="tab-1">
              {tabValue === 1 && (
                <Box sx={{ p: 3 }}>
                  <Typography variant="subtitle1" fontWeight={600}>Product Specifications</Typography>
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={6}>
                      <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                        <Typography variant="body2" color="text.secondary">Brand</Typography>
                        <Typography variant="body1">SQA Store Brand</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                        <Typography variant="body2" color="text.secondary">Model</Typography>
                        <Typography variant="body1">SQA-{product._id?.substring(0, 6) || '000000'}</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                        <Typography variant="body2" color="text.secondary">Warranty</Typography>
                        <Typography variant="body1">1 Year Limited Warranty</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                        <Typography variant="body2" color="text.secondary">Category</Typography>
                        <Typography variant="body1">{product.category?.name || 'Uncategorized'}</Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Box>
            
            <Box role="tabpanel" hidden={tabValue !== 2} id="tabpanel-2" aria-labelledby="tab-2">
              {tabValue === 2 && (
                <Box sx={{ p: 3 }}>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Customer Reviews
                  </Typography>
                  
                  {/* Sample reviews */}
                  {[
                    { name: 'John D.', rating: 5, comment: 'Great product! Exactly as described.', date: '2023-04-15' },
                    { name: 'Sarah M.', rating: 4, comment: 'Good quality but shipping took longer than expected.', date: '2023-03-22' },
                    { name: 'Robert K.', rating: 5, comment: 'Excellent value for money. Would buy again!', date: '2023-02-28' },
                  ].map((review, index) => (
                    <Paper key={index} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle2" fontWeight={600}>{review.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{review.date}</Typography>
                      </Box>
                      <Rating value={review.rating} size="small" readOnly />
                      <Typography variant="body2" sx={{ mt: 1 }}>{review.comment}</Typography>
                    </Paper>
                  ))}
                </Box>
              )}
            </Box>
          </Box>
          
          {/* Related products */}
          <Box sx={{ mt: 6 }}>
            <Typography variant="h5" component="h2" fontWeight={600} gutterBottom>
              Related Products
            </Typography>
            <Grid container spacing={3}>
              {[1, 2, 3, 4].map((item) => (
                <Grid item xs={6} md={3} key={item}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 2,
                      transition: 'transform 0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 3,
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="160"
                      image={`https://via.placeholder.com/300x160?text=Related+Product+${item}`}
                      alt={`Related Product ${item}`}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="body1" component="h3" fontWeight={600}>
                        Related Product {item}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Category
                      </Typography>
                      <Typography variant="h6" color="primary" fontWeight={700}>
                        ${(product.price * 0.8).toFixed(2)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      ) : (
        <Alert severity="warning" sx={{ my: 4 }}>
          Product not found. Please check the URL or go back to the products page.
        </Alert>
      )}
    </Container>
  );
};

export default ProductDetail;