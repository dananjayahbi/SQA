import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  InputAdornment,
  Pagination,
  CircularProgress,
  Alert,
  useMediaQuery,
  Container,
  Stack,
  Rating,
  Snackbar,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SortIcon from '@mui/icons-material/Sort';
import { productAPI, categoryAPI } from '../utils/api';
import { useCart } from '../contexts/CartContext';

const ProductStore = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { addToCart, stockExceededMessage } = useCart();
  
  // State
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({ open: false, message: '' });
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sort, setSort] = useState('newest');
  
  // Load products and categories
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [productsData, categoriesData] = await Promise.all([
          productAPI.getAll(),
          categoryAPI.getAll()
        ]);
        
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        setError('Failed to load products. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Apply filters and sorting
  const filteredProducts = products
    .filter(product => 
      // Filter by search query
      (searchQuery === '' || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
      ) &&
      // Filter by category
      (selectedCategory === '' || product.category._id === selectedCategory) &&
      // Only show active products with stock
      product.isActive && product.stock > 0
    )
    .sort((a, b) => {
      switch (sort) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'newest':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  // Handle search change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  
  // Handle sort change
  const handleSortChange = (event) => {
    setSort(event.target.value);
  };
  
  // Handle add to cart
  const handleAddToCart = (product) => {
    const added = addToCart(product);
    if (added) {
      setNotification({
        open: true,
        message: `${product.name} added to cart!`
      });
    }
  };
  
  // Handle notification close
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };
  
  // Helper function to get product image URL
  const getImageUrl = (product) => {
    if (product.images && product.images.length > 0) {
      if (product.images[0].startsWith('http')) {
        return product.images[0];
      } else {
        return `http://localhost:5000${product.images[0]}`;
      }
    }
    return 'https://via.placeholder.com/300x200?text=No+Image';
  };

  return (
    <Container sx={{ py: 4 }}>
      {/* Page Title */}
      <Box mb={4}>
        <Typography variant="h4" component="h1" fontWeight={600} gutterBottom>
          Browse Products
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Discover our collection of high-quality products
        </Typography>
      </Box>
      
      {/* Notifications */}
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={handleCloseNotification}
        message={notification.message}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      />
      
      <Snackbar
        open={!!stockExceededMessage}
        autoHideDuration={3000}
        message={stockExceededMessage}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        ContentProps={{
          sx: { bgcolor: 'warning.main', color: 'warning.contrastText' }
        }}
      />
      
      {/* Search and Filter Bar */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2, 
          mb: 3, 
          borderRadius: 1, 
          border: '1px solid #e0e0e0' 
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              size="small"
            />
          </Grid>
          
          <Grid item xs={5} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterListIcon />}
              sx={{ height: '40px' }}
            >
              Filters
            </Button>
          </Grid>
          
          <Grid item xs={7} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mr: 1, whiteSpace: 'nowrap' }}>
                Sort By
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={sort}
                  onChange={handleSortChange}
                  displayEmpty
                  variant="outlined"
                  startAdornment={
                    <InputAdornment position="start">
                      <SortIcon />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="newest">Newest</MenuItem>
                  <MenuItem value="price-low">Price: Low to High</MenuItem>
                  <MenuItem value="price-high">Price: High to Low</MenuItem>
                  <MenuItem value="name-asc">Name: A to Z</MenuItem>
                  <MenuItem value="name-desc">Name: Z to A</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Product Count */}
      <Box mb={2}>
        <Typography variant="body2" color="text.secondary">
          Showing 1-{filteredProducts.length} of {filteredProducts.length} products
        </Typography>
      </Box>
      
      {/* Error state */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Loading state */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        /* Product grid */
        <Grid container spacing={3}>
          {filteredProducts.map(product => (
            <Grid item xs={12} sm={6} md={4} key={product._id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  border: '1px solid #e0e0e0',
                  borderRadius: 2,
                  boxShadow: 'none'
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    image={getImageUrl(product)}
                    alt={product.name}
                    sx={{ 
                      height: 200,
                      objectFit: 'cover'
                    }}
                  />
                  {product.stock <= 5 && (
                    <Chip 
                      label={`Only ${product.stock} left`} 
                      size="small"
                      sx={{ 
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        bgcolor: '#ff7043',
                        color: 'white',
                        fontWeight: 500,
                      }}
                    />
                  )}
                  <Box sx={{ 
                    position: 'absolute', 
                    bottom: 0, 
                    left: 0, 
                    p: 1, 
                    bgcolor: '#f5f5f5'
                  }}>
                    <Typography variant="caption">
                      {product.category?.name || 'Uncategorized'}
                    </Typography>
                  </Box>
                </Box>
                
                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                  <Typography 
                    variant="h6" 
                    component="h2" 
                    sx={{ 
                      fontWeight: 600,
                      mb: 1,
                      fontSize: '1rem',
                    }}
                  >
                    {product.name}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating 
                      value={4.5} 
                      readOnly 
                      precision={0.5}
                      size="small"
                    />
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ ml: 1, fontSize: '0.75rem' }}
                    >
                      (24)
                    </Typography>
                  </Box>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {product.description || 'Test Description'}
                  </Typography>
                  
                  <Typography 
                    variant="h6" 
                    color="primary" 
                    sx={{ 
                      fontWeight: 700, 
                      mt: 'auto',
                      fontSize: '1.25rem',
                    }}
                  >
                    ${product.price?.toFixed(2)}
                  </Typography>
                </CardContent>
                
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    startIcon={<ShoppingCartIcon />}
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                  >
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default ProductStore;