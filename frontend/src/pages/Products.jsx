import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Button, 
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CircularProgress,
  Alert,
  Menu,
  MenuItem,
  Chip,
  Stack,
  Divider,
  Tooltip,
  CardActionArea,
  CardActions,
  Avatar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import { alpha } from '@mui/material/styles';
import { productAPI } from '../utils/api';
import ProductForm from '../components/ProductForm';

const Products = () => {
  const theme = useTheme();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Dialog states
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuProduct, setMenuProduct] = useState(null);

  // Load products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await productAPI.getAll();
      setProducts(data);
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Menu handlers
  const handleMenuOpen = (event, product) => {
    setAnchorEl(event.currentTarget);
    setMenuProduct(product);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuProduct(null);
  };

  // Dialog handlers
  const handleAddDialogOpen = () => {
    setOpenAddDialog(true);
  };

  const handleAddDialogClose = () => {
    setOpenAddDialog(false);
  };

  const handleEditDialogOpen = (product) => {
    setSelectedProduct(product);
    setOpenEditDialog(true);
    handleMenuClose();
  };

  const handleEditDialogClose = () => {
    setOpenEditDialog(false);
    setSelectedProduct(null);
  };

  const handleDeleteDialogOpen = (product) => {
    setSelectedProduct(product);
    setOpenDeleteDialog(true);
    handleMenuClose();
  };

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
    setSelectedProduct(null);
  };

  // CRUD operations
  const handleCreateProduct = async (result) => {
    setProducts(prevProducts => [result, ...prevProducts]);
    handleAddDialogClose();
  };

  const handleUpdateProduct = async (result) => {
    setProducts(prevProducts => 
      prevProducts.map(product => 
        product._id === result._id ? result : product
      )
    );
    handleEditDialogClose();
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;
    
    try {
      await productAPI.delete(selectedProduct._id);
      setProducts(prevProducts => 
        prevProducts.filter(product => product._id !== selectedProduct._id)
      );
      handleDeleteDialogClose();
    } catch (err) {
      setError('Failed to delete product');
      console.error(err);
    }
  };

  // Get image URL helper
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
    <Box>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 4
      }}>
        <Typography
          variant="h1"
          component="h1"
          sx={{ 
            fontWeight: 700,
            color: theme.palette.text.primary
          }}
        >
          Products
        </Typography>
        
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          sx={{ borderRadius: '8px', px: 3 }}
          onClick={handleAddDialogOpen}
        >
          Add Product
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : products.length === 0 ? (
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Typography variant="body1" color="text.secondary">
            No products found. Add your first product to get started.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
              <Card 
                sx={{ 
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: `0 6px 16px 0 ${alpha(theme.palette.grey[900], 0.08)}`,
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 12px 24px 0 ${alpha(theme.palette.grey[900], 0.12)}`
                  }
                }}
              >
                {/* Status chip */}
                {product.isActive !== undefined && (
                  <Chip
                    label={product.isActive ? 'Active' : 'Inactive'}
                    color={product.isActive ? 'success' : 'default'}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 12,
                      left: 12,
                      zIndex: 2,
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  />
                )}
                
                <IconButton
                  aria-label="more"
                  sx={{ 
                    position: 'absolute', 
                    top: 8, 
                    right: 8, 
                    bgcolor: 'rgba(255,255,255,0.9)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,1)'
                    }
                  }}
                  onClick={(e) => handleMenuOpen(e, product)}
                >
                  <MoreVertIcon />
                </IconButton>
                
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={getImageUrl(product)}
                    alt={product.name}
                    sx={{ 
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05)'
                      }
                    }}
                  />
                  <Box 
                    sx={{ 
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
                      height: '80px',
                      display: 'flex',
                      alignItems: 'flex-end',
                      padding: 2
                    }}
                  >
                    <Chip
                      icon={<CategoryIcon sx={{ fontSize: '1rem !important', color: 'inherit' }} />}
                      label={product.category?.name || 'Uncategorized'}
                      size="small"
                      variant="filled"
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.9)', 
                        color: theme.palette.text.primary,
                        '& .MuiChip-icon': {
                          color: theme.palette.primary.main
                        }
                      }}
                    />
                  </Box>
                </Box>
                
                <CardContent sx={{ flexGrow: 1, pt: 2 }}>
                  <Typography variant="h6" component="div" sx={{ fontWeight: 600, mb: 1, height: '3rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {product.name}
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mb: 2,
                      height: '3rem',
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}
                  >
                    {product.description || 'No description available'}
                  </Typography>
                  
                  <Divider sx={{ my: 1.5 }} />
                  
                  <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                    <Typography variant="h5" color="primary" fontWeight={700}>
                      ${product.price?.toFixed(2)}
                    </Typography>
                    
                    <Tooltip title="Available Stock" arrow>
                      <Chip
                        icon={<InventoryIcon sx={{ fontSize: '1rem !important' }} />}
                        label={`${product.stock || 0} in stock`}
                        size="small"
                        color={product.stock > 0 ? 'info' : 'error'}
                        variant="outlined"
                        style={{padding: '4px 8px'}}
                      />
                    </Tooltip>
                  </Stack>
                </CardContent>
                
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button 
                    size="small" 
                    startIcon={<EditIcon />} 
                    onClick={() => handleEditDialogOpen(product)}
                    fullWidth
                    variant="outlined"
                    style={{padding: '7px 0px 5px 0px'}}
                  >
                    Edit
                  </Button>
                  <Button 
                    size="small" 
                    startIcon={<DeleteIcon />} 
                    onClick={() => handleDeleteDialogOpen(product)}
                    fullWidth
                    variant="outlined"
                    color="error"
                    style={{padding: '7px 0px 5px 0px'}}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Product menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleEditDialogOpen(menuProduct)}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={() => handleDeleteDialogOpen(menuProduct)} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Add product dialog */}
      <Dialog 
        open={openAddDialog} 
        onClose={handleAddDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent>
          <ProductForm 
            onSubmitSuccess={handleCreateProduct}
            onCancel={handleAddDialogClose}
          />
        </DialogContent>
      </Dialog>

      {/* Edit product dialog */}
      <Dialog 
        open={openEditDialog} 
        onClose={handleEditDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          {selectedProduct && (
            <ProductForm 
              product={selectedProduct}
              onSubmitSuccess={handleUpdateProduct}
              onCancel={handleEditDialogClose}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete product dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteDialogClose}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedProduct?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Cancel</Button>
          <Button 
            onClick={handleDeleteProduct} 
            color="error" 
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Products; 