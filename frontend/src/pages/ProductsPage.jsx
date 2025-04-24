import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Slider,
  Divider,
  Drawer,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SortIcon from '@mui/icons-material/Sort';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TuneIcon from '@mui/icons-material/Tune';
import CloseIcon from '@mui/icons-material/Close';
import { productAPI, categoryAPI } from '../utils/api';
import { useCart } from '../contexts/CartContext';

const ProductsPage = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { addToCart, stockExceededMessage } = useCart();
  
  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const queryCategory = queryParams.get('category');
  const querySearch = queryParams.get('search');
  
  // State
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({ open: false, message: '' });
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState(querySearch || '');
  const [selectedCategories, setSelectedCategories] = useState(queryCategory ? [queryCategory] : []);
  const [sort, setSort] = useState('newest');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  
  const ITEMS_PER_PAGE = 12;
  
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
        
        // If we have products, set the price range
        if (productsData.length > 0) {
          const prices = productsData.map(p => p.price);
          const minPrice = Math.floor(Math.min(...prices));
          const maxPrice = Math.ceil(Math.max(...prices));
          setPriceRange([minPrice, maxPrice]);
        }
      } catch (err) {
        setError('Failed to load products. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Apply filters
  const filteredProducts = products
    .filter(product => {
      // Filter by search query
      const matchesSearch = searchQuery === '' || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Filter by selected categories
      const matchesCategory = selectedCategories.length === 0 || 
        (product.category && selectedCategories.includes(product.category._id));
      
      // Filter by price range
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      
      // Filter by stock
      const matchesStock = !inStockOnly || product.stock > 0;
      
      return matchesSearch && matchesCategory && matchesPrice && matchesStock && product.isActive;
    })
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

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const displayedProducts = filteredProducts.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );
  
  // Handle search change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1); // Reset to first page when search changes
  };
  
  // Handle search submit
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    // Update URL with search query
    const params = new URLSearchParams(location.search);
    if (searchQuery) {
      params.set('search', searchQuery);
    } else {
      params.delete('search');
    }
    navigate({ search: params.toString() });
  };
  
  // Handle sort change
  const handleSortChange = (event) => {
    setSort(event.target.value);
  };
  
  // Handle category filter change
  const handleCategoryChange = (categoryId) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
    setPage(1); // Reset to first page when categories change
  };
  
  // Handle price range change
  const handlePriceRangeChange = (event, newValue) => {
    setPriceRange(newValue);
  };
  
  // Handle stock filter change
  const handleStockFilterChange = (event) => {
    setInStockOnly(event.target.checked);
    setPage(1); // Reset to first page when stock filter changes
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
  
  // Handle page change
  const handlePageChange = (event, value) => {
    setPage(value);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Handle notification close
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };
  
  // Toggle filter drawer
  const toggleFilterDrawer = () => {
    setFilterDrawerOpen(!filterDrawerOpen);
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

  // Filter sidebar/drawer content
  const filterContent = (
    <Box sx={{ p: 3, width: isMobile ? 'auto' : 280 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 2 
      }}>
        <Typography variant="h6" fontWeight={600}>
          Filters
        </Typography>
        {isMobile && (
          <IconButton onClick={toggleFilterDrawer}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      {/* Category filter */}
      <Accordion defaultExpanded sx={{ mb: 2, boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1" fontWeight={600}>Categories</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List dense disablePadding sx={{ mt: -1 }}>
            {/* All Categories option */}
            <ListItem disablePadding sx={{ py: 0 }}>
              <ListItemButton 
                role={undefined} 
                onClick={() => setSelectedCategories([])}
                dense
              >
                <Checkbox
                  edge="start"
                  checked={selectedCategories.length === 0}
                  tabIndex={-1}
                  disableRipple
                  data-testid="category-checkbox-all"
                />
                <ListItemText 
                  primary="All"
                  primaryTypographyProps={{ 
                    variant: 'body2',
                    fontWeight: selectedCategories.length === 0 ? 600 : 400
                  }}
                />
              </ListItemButton>
            </ListItem>
            
            {/* Divider between All and specific categories */}
            <Divider sx={{ my: 1 }} />
            
            {categories.map((category) => (
              <ListItem key={category._id} disablePadding sx={{ py: 0 }}>
                <ListItemButton 
                  role={undefined} 
                  onClick={() => handleCategoryChange(category._id)}
                  dense
                >
                  <Checkbox
                    edge="start"
                    checked={selectedCategories.includes(category._id)}
                    tabIndex={-1}
                    disableRipple
                    data-testid={`category-checkbox-${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                  />
                  <ListItemText 
                    primary={category.name} 
                    primaryTypographyProps={{ 
                      variant: 'body2',
                      fontWeight: selectedCategories.includes(category._id) ? 600 : 400
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
      
      {/* Price range filter */}
      <Accordion defaultExpanded sx={{ mb: 2, boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1" fontWeight={600}>Price Range</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ px: 1 }}>
            <Slider
              value={priceRange}
              onChange={handlePriceRangeChange}
              valueLabelDisplay="auto"
              min={0}
              max={20000}
              data-testid="price-range-slider"
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="body2">${priceRange[0]}</Typography>
              <Typography variant="body2">${priceRange[1]}</Typography>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
      
      {/* Stock filter */}
      <Accordion defaultExpanded sx={{ mb: 3, boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1" fontWeight={600}>Availability</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox 
                  checked={inStockOnly} 
                  onChange={handleStockFilterChange}
                  data-testid="in-stock-checkbox"
                />
              }
              label="In Stock Only"
            />
          </FormGroup>
        </AccordionDetails>
      </Accordion>
      
      {isMobile && (
        <Button 
          variant="contained" 
          fullWidth 
          onClick={toggleFilterDrawer}
          sx={{ mt: 2 }}
        >
          Apply Filters
        </Button>
      )}
    </Box>
  );

  return (
    <Box>
      {/* Hero banner */}
      <Box
        sx={{
          bgcolor: theme.palette.primary.main,
          color: 'white',
          py: { xs: 4, md: 6 },
          mb: 4,
        }}
      >
        <Container>
          <Typography
            variant="h3"
            component="h1"
            fontWeight={700}
            gutterBottom
            data-testid="products-page-title"
          >
            Our Products
          </Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.9, maxWidth: 700 }}>
            Browse our collection of high-quality products. Use filters to find exactly what you're looking for.
          </Typography>
        </Container>
      </Box>
      
      <Container>
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
        
        {/* Search and Sort Bar */}
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
              <Box component="form" onSubmit={handleSearchSubmit}>
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
                    endAdornment: searchQuery && (
                      <InputAdornment position="end">
                        <IconButton 
                          size="small" 
                          onClick={() => setSearchQuery('')}
                          edge="end"
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  size="small"
                  data-testid="product-search-input"
                  sx={{ zIndex: 1 }} // Ensure the input is on top and clickable
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearchSubmit(e);
                    }
                  }}
                />
              </Box>
            </Grid>
            
            <Grid item xs={5} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterListIcon />}
                onClick={toggleFilterDrawer}
                sx={{ height: '40px' }}
                data-testid="filter-button"
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
                    data-testid="sort-select"
                    startAdornment={
                      <InputAdornment position="start">
                        <SortIcon />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value="newest" data-testid="sort-newest">Newest</MenuItem>
                    <MenuItem value="price-low" data-testid="sort-price-low">Price: Low to High</MenuItem>
                    <MenuItem value="price-high" data-testid="sort-price-high">Price: High to Low</MenuItem>
                    <MenuItem value="name-asc" data-testid="sort-name-asc">Name: A to Z</MenuItem>
                    <MenuItem value="name-desc" data-testid="sort-name-desc">Name: Z to A</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>
          </Grid>
        </Paper>
        
        {/* Mobile filter drawer */}
        <Drawer
          anchor="left"
          open={isMobile && filterDrawerOpen}
          onClose={toggleFilterDrawer}
        >
          {filterContent}
        </Drawer>
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
          {/* Filter sidebar (desktop) */}
          {!isMobile && (
            <Box 
              sx={{ 
                width: { md: '280px' }, 
                flexShrink: 0,
                position: { md: 'sticky' },
                top: '24px',
                alignSelf: 'flex-start'
              }}
            >
              {filterContent}
            </Box>
          )}
          
          {/* Product grid */}
          <Box sx={{ flexGrow: 1, ml: { md: 3 } }}>
            {/* Product count */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {filteredProducts.length === 0 ? 'No products found' : 
                  `Showing ${(page - 1) * ITEMS_PER_PAGE + 1}-${Math.min(page * ITEMS_PER_PAGE, filteredProducts.length)} of ${filteredProducts.length} products`}
              </Typography>
              
              {!isMobile && totalPages > 1 && (
                <Pagination 
                  count={totalPages} 
                  page={page} 
                  onChange={handlePageChange} 
                  color="primary" 
                  size="small"
                  data-testid="pagination"
                />
              )}
            </Box>
            
            {/* Error message */}
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
            ) : filteredProducts.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No products found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Try adjusting your search or filter criteria
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {displayedProducts.map(product => (
                  <Grid item xs={12} sm={6} md={6} lg={4} xl={3} key={product._id} sx={{ display: 'flex' }}>
                    <Card 
                      sx={{ 
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        border: '1px solid #e0e0e0',
                        borderRadius: 2,
                        boxShadow: 'none',
                        transition: 'transform 0.3s, box-shadow 0.3s',
                        position: 'relative',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: 3,
                        },
                      }}
                      data-testid={`product-card-${product._id}`}
                    >
                      {/* Out of stock overlay */}
                      {product.stock === 0 && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            zIndex: 1,
                            bgcolor: 'rgba(255, 255, 255, 0.6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 2,
                          }}
                          data-testid="out-of-stock-overlay"
                        >
                          <Chip 
                            label="Out of Stock" 
                            color="error" 
                            sx={{ fontWeight: 600 }} 
                          />
                        </Box>
                      )}
                      
                      <Link 
                        to={`/store/products/${product._id}`} 
                        style={{ textDecoration: 'none', color: 'inherit' }}
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
                            data-testid="product-image"
                          />
                          {product.stock > 0 && product.stock <= 5 && (
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
                              data-testid="low-stock-badge"
                            />
                          )}
                        </Box>
                        
                        <CardContent sx={{ flexGrow: 1, p: 2 }}>
                          <Typography 
                            variant="subtitle1" 
                            component="h2" 
                            sx={{ 
                              fontWeight: 600,
                              mb: 1,
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              height: 48,
                            }}
                            data-testid="product-name"
                          >
                            {product.name}
                          </Typography>
                          
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ 
                              mb: 1,
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              height: 40,
                            }}
                            data-testid="product-description"
                          >
                            {product.description || 'No description available'}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                              Category:
                            </Typography>
                            <Typography variant="caption" fontWeight={500}>
                              {product.category?.name || 'Uncategorized'}
                            </Typography>
                          </Box>
                          
                          <Typography 
                            variant="h6" 
                            color="primary" 
                            sx={{ 
                              fontWeight: 700, 
                              mt: 'auto',
                            }}
                            data-testid="product-price"
                          >
                            ${product.price?.toFixed(2)}
                          </Typography>
                        </CardContent>
                      </Link>
                      
                      <CardActions sx={{ p: 2, pt: 0 }}>
                        <Button
                          fullWidth
                          variant="contained"
                          color="primary"
                          startIcon={<ShoppingCartIcon />}
                          onClick={() => handleAddToCart(product)}
                          disabled={product.stock === 0}
                          data-testid="add-to-cart-button"
                        >
                          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
            
            {/* Pagination (bottom) */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination 
                  count={totalPages} 
                  page={page} 
                  onChange={handlePageChange} 
                  color="primary"
                  size={isMobile ? 'small' : 'medium'}
                />
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ProductsPage;