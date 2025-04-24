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
  Slider,
  Paper,
  InputAdornment,
  Pagination,
  CircularProgress,
  Alert,
  Divider,
  Drawer,
  useMediaQuery,
  Badge,
  Snackbar,
  Container,
  Stack,
  Rating,
  Tooltip,
  Fab,
  SwipeableDrawer
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import CategoryIcon from '@mui/icons-material/Category';
import SortIcon from '@mui/icons-material/Sort';
import TuneIcon from '@mui/icons-material/Tune';
import CloseIcon from '@mui/icons-material/Close';
import { productAPI, categoryAPI } from '../utils/api';
import { useCart } from '../contexts/CartContext';

const ProductStore = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { cart, addToCart } = useCart();
  
  // State
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({ open: false, message: '' });
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sort, setSort] = useState('newest');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  
  // Pagination
  const [page, setPage] = useState(1);
  // Adjust items per page based on screen size
  const itemsPerPage = isSmallScreen ? 6 : isMobile ? 8 : 12;

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
        
        // Set initial max price based on products
        if (productsData.length > 0) {
          const maxPrice = Math.ceil(Math.max(...productsData.map(p => p.price)));
          setPriceRange([0, maxPrice]);
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
      // Filter by price range
      (product.price >= priceRange[0] && product.price <= priceRange[1]) &&
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
  
  // Pagination logic
  const indexOfLastItem = page * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);
  
  // Handle pagination change
  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Filter handlers
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };
  
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setPage(1);
  };
  
  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
    setPage(1);
  };
  
  const handleSortChange = (event) => {
    setSort(event.target.value);
  };
  
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    // Reset price range to include all products
    const maxPrice = Math.ceil(Math.max(...products.map(p => p.price)));
    setPriceRange([0, maxPrice]);
    setSort('newest');
    setPage(1);
  };
  
  // Cart handlers
  const handleAddToCart = (product) => {
    addToCart(product);
    setNotification({
      open: true,
      message: `${product.name} added to cart!`
    });
  };
  
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
  
  // Filter drawer content
  const filterDrawerContent = (
    <Box sx={{ 
      width: isMobile ? '100vw' : 280, 
      p: 3, 
      height: '100%', 
      overflow: 'auto',
      maxHeight: isMobile ? '90vh' : '100vh'
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h2" fontWeight={600}>
          Filters
        </Typography>
        <IconButton onClick={() => setFilterDrawerOpen(false)}>
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        Categories
      </Typography>
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel id="category-select-label">Category</InputLabel>
        <Select
          labelId="category-select-label"
          id="category-select"
          value={selectedCategory}
          label="Category"
          onChange={handleCategoryChange}
        >
          <MenuItem value="">All Categories</MenuItem>
          {categories.map((category) => (
            <MenuItem key={category._id} value={category._id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        Price Range
      </Typography>
      <Box sx={{ px: 1, mb: 3 }}>
        <Slider
          value={priceRange}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          min={0}
          max={Math.max(1000, Math.ceil(Math.max(...products.map(p => p.price))))}
          valueLabelFormat={(value) => `$${value}`}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            ${priceRange[0]}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ${priceRange[1]}
          </Typography>
        </Box>
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button 
          variant="outlined" 
          onClick={handleResetFilters}
          startIcon={<TuneIcon />}
        >
          Reset Filters
        </Button>
        <Button 
          variant="contained" 
          onClick={() => setFilterDrawerOpen(false)}
        >
          Apply
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile filter FAB */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="filter"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 999,
            display: { xs: 'flex', md: 'none' }
          }}
          onClick={() => setFilterDrawerOpen(true)}
        >
          <FilterListIcon />
        </Fab>
      )}
    
      <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 4, lg: 6 } }}>
        <Snackbar
          open={notification.open}
          autoHideDuration={3000}
          onClose={handleCloseNotification}
          message={notification.message}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{
            '& .MuiSnackbarContent-root': {
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }
          }}
        />
        
        <SwipeableDrawer
          anchor={isMobile ? 'bottom' : 'right'}
          open={filterDrawerOpen}
          onClose={() => setFilterDrawerOpen(false)}
          onOpen={() => setFilterDrawerOpen(true)}
          disableSwipeToOpen={false}
          PaperProps={{
            sx: {
              borderRadius: isMobile ? '16px 16px 0 0' : 0,
              height: isMobile ? '90vh' : '100%',
              maxHeight: isMobile ? '90vh' : '100%',
              overflowY: 'auto'
            }
          }}
          swipeAreaWidth={isMobile ? 30 : 0}
        >
          {filterDrawerContent}
        </SwipeableDrawer>
        
        <Box sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
          <Box sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
            <Typography 
              variant={isSmallScreen ? "h5" : "h4"} 
              component="h1" 
              fontWeight={700} 
              gutterBottom
              sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } }}
            >
              Browse Products
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
            >
              Discover our collection of high-quality products
            </Typography>
          </Box>
          
          <Grid container spacing={2}>
            {/* Filters and search section */}
            <Grid item xs={12}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: { xs: 1.5, sm: 2 }, 
                  borderRadius: '12px',
                  border: `1px solid ${theme.palette.divider}`,
                  mb: { xs: 2, sm: 3 }
                }}
              >
                <Grid container spacing={1.5} alignItems="center">
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
                      sx={{ bgcolor: 'background.paper' }}
                    />
                  </Grid>
                  
                  <Grid item xs={5} md={2} sx={{ display: { xs: 'block', md: 'block' } }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<FilterListIcon />}
                      onClick={() => setFilterDrawerOpen(true)}
                      sx={{ height: '100%' }}
                    >
                      Filters
                    </Button>
                  </Grid>
                  
                  <Grid item xs={7} md={4}>
                    <FormControl fullWidth>
                      <InputLabel id="sort-select-label">Sort By</InputLabel>
                      <Select
                        labelId="sort-select-label"
                        id="sort-select"
                        value={sort}
                        label="Sort By"
                        onChange={handleSortChange}
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
                  </Grid>
                </Grid>
                
                {/* Active filters */}
                {(searchQuery || selectedCategory || priceRange[0] > 0 || priceRange[1] < Math.max(1000, Math.ceil(Math.max(...products.map(p => p.price))))) && (
                  <Stack 
                    direction="row" 
                    spacing={1} 
                    sx={{ 
                      mt: 2, 
                      flexWrap: 'wrap', 
                      gap: 1,
                      display: { xs: 'none', sm: 'flex' } // Hide on extra small screens
                    }}
                  >
                    <Typography variant="body2" color="text.secondary" sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                      Active Filters:
                    </Typography>
                    
                    {searchQuery && (
                      <Chip 
                        label={`Search: ${searchQuery}`} 
                        onDelete={() => setSearchQuery('')}
                        size="small"
                      />
                    )}
                    
                    {selectedCategory && (
                      <Chip 
                        icon={<CategoryIcon />}
                        label={`Category: ${categories.find(c => c._id === selectedCategory)?.name || ''}`} 
                        onDelete={() => setSelectedCategory('')}
                        size="small"
                      />
                    )}
                    
                    {(priceRange[0] > 0 || priceRange[1] < Math.max(1000, Math.ceil(Math.max(...products.map(p => p.price))))) && (
                      <Chip 
                        label={`Price: $${priceRange[0]} - $${priceRange[1]}`} 
                        onDelete={() => setPriceRange([0, Math.max(1000, Math.ceil(Math.max(...products.map(p => p.price))))])}
                        size="small"
                      />
                    )}
                    
                    <Button 
                      variant="text" 
                      size="small" 
                      onClick={handleResetFilters} 
                      sx={{ ml: 'auto', fontSize: '0.75rem' }}
                    >
                      Clear All
                    </Button>
                  </Stack>
                )}
              </Paper>
            </Grid>
          </Grid>
          
          {/* Results count and pagination info */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 2,
            flexWrap: { xs: 'wrap', sm: 'nowrap' },
            gap: 1
          }}>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            >
              Showing {filteredProducts.length > 0 ? (page - 1) * itemsPerPage + 1 : 0}-{Math.min(page * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products
            </Typography>
            
            {/* Small screen pagination */}
            {isSmallScreen && pageCount > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 1 }}>
                <Pagination 
                  count={pageCount} 
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  size="small"
                  siblingCount={0}
                  boundaryCount={1}
                />
              </Box>
            )}
          </Box>
          
          {/* Error state */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          {/* Loading state */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: { xs: 4, sm: 6, md: 8 } }}>
              <CircularProgress />
            </Box>
          ) : filteredProducts.length === 0 ? (
            <Paper 
              elevation={0}
              sx={{ 
                p: { xs: 3, sm: 4 }, 
                borderRadius: '12px',
                border: `1px solid ${theme.palette.divider}`,
                textAlign: 'center'
              }}
            >
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No products found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your filters or search criteria.
              </Typography>
              <Button 
                variant="outlined" 
                onClick={handleResetFilters} 
                sx={{ mt: 2 }}
              >
                Clear Filters
              </Button>
            </Paper>
          ) : (
            <>
              {/* Product grid */}
              <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
                {currentItems.map(product => (
                  <Grid item xs={6} sm={6} md={4} lg={3} xl={2} key={product._id}>
                    <Card 
                      sx={{ 
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: { xs: '8px', sm: '12px' },
                        overflow: 'hidden',
                        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: `0 8px 24px 0 ${alpha(theme.palette.grey[900], 0.1)}`
                        }
                      }}
                    >
                      <Box sx={{ position: 'relative', pt: '70%' }}>
                        <CardMedia
                          component="img"
                          image={getImageUrl(product)}
                          alt={product.name}
                          sx={{ 
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                        <Box 
                          sx={{ 
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            display: 'flex',
                            gap: 1
                          }}
                        >
                          {product.stock <= 5 && (
                            <Chip 
                              label={`Only ${product.stock} left`} 
                              color="warning"
                              size="small"
                              sx={{ 
                                fontWeight: 600,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                fontSize: { xs: '0.6rem', sm: '0.7rem' },
                                height: { xs: '20px', sm: '24px' }
                              }}
                            />
                          )}
                        </Box>
                      </Box>
                      
                      <CardContent sx={{ 
                        flexGrow: 1, 
                        display: 'flex', 
                        flexDirection: 'column',
                        p: { xs: 1.5, sm: 2 }
                      }}>
                        <Box sx={{ mb: 1 }}>
                          <Chip
                            icon={<CategoryIcon sx={{ fontSize: '0.8rem !important' }} />}
                            label={product.category?.name || 'Uncategorized'}
                            size="small"
                            sx={{ 
                              fontWeight: 500,
                              fontSize: { xs: '0.6rem', sm: '0.7rem' },
                              mb: 1,
                              height: { xs: '20px', sm: '24px' }
                            }}
                          />
                        </Box>
                        
                        <Typography 
                          variant="h6" 
                          component="h2" 
                          gutterBottom
                          sx={{ 
                            fontWeight: 600,
                            fontSize: { xs: '0.875rem', sm: '1rem' },
                            height: { xs: '2.5rem', sm: '3rem' },
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                          }}
                        >
                          {product.name}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Rating 
                            value={4.5} 
                            readOnly 
                            precision={0.5} 
                            size={isSmallScreen ? "small" : "medium"}
                            sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}
                          />
                          <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            sx={{ 
                              ml: 1, 
                              fontSize: { xs: '0.7rem', sm: '0.75rem' }
                            }}
                          >
                            (24)
                          </Typography>
                        </Box>
                        
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            mb: 2,
                            flexGrow: 1,
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                            height: { xs: '2.2rem', sm: '2.5rem' }
                          }}
                        >
                          {product.description || 'No description available'}
                        </Typography>
                        
                        <Typography 
                          variant="h6" 
                          color="primary" 
                          sx={{ 
                            fontWeight: 700, 
                            mt: 'auto',
                            fontSize: { xs: '1rem', sm: '1.25rem' }
                          }}
                        >
                          ${product.price?.toFixed(2)}
                        </Typography>
                      </CardContent>
                      
                      <CardActions sx={{ p: { xs: 1.5, sm: 2 }, pt: 0 }}>
                        <Button
                          fullWidth
                          variant="contained"
                          startIcon={isSmallScreen ? null : <AddShoppingCartIcon />}
                          onClick={() => handleAddToCart(product)}
                          size={isSmallScreen ? "small" : "large"}
                          sx={{ 
                            borderRadius: '8px',
                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                            py: { xs: 0.5, sm: 1 }
                          }}
                        >
                          {isSmallScreen ? 'Add' : 'Add to Cart'}
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              
              {/* Pagination - only show on medium and larger screens */}
              {!isSmallScreen && pageCount > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination 
                    count={pageCount} 
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    size={isMobile ? 'small' : 'medium'}
                    siblingCount={isMobile ? 0 : 1}
                    boundaryCount={isMobile ? 1 : 2}
                  />
                </Box>
              )}
            </>
          )}
        </Box>
      </Container>

      {/* Shopping cart indicator */}
      {isMobile && cart.totalItems > 0 && (
        <Fab
          color="secondary"
          aria-label="cart"
          sx={{
            position: 'fixed',
            bottom: 16,
            left: 16,
            zIndex: 999,
            display: { xs: 'flex', md: 'none' }
          }}
          onClick={() => window.dispatchEvent(new CustomEvent('open-cart'))}
        >
          <Badge badgeContent={cart.totalItems} color="error">
            <ShoppingCartIcon />
          </Badge>
        </Fab>
      )}
    </>
  );
};

export default ProductStore;