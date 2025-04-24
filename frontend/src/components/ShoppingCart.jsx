import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  TextField,
  Badge,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  CircularProgress,
  Alert
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import { useCart } from '../contexts/CartContext';

const ShoppingCart = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart } = useCart();
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  
  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };
  
  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };
  
  const handleCheckoutOpen = () => {
    setCheckoutDialogOpen(true);
    setCheckoutError('');
    setCheckoutSuccess(false);
  };
  
  const handleCheckoutClose = () => {
    setCheckoutDialogOpen(false);
    if (checkoutSuccess) {
      setDrawerOpen(false);
    }
  };
  
  const handleCheckout = () => {
    setCheckoutLoading(true);
    setCheckoutError('');
    
    // Simulate checkout process
    setTimeout(() => {
      setCheckoutLoading(false);
      setCheckoutSuccess(true);
      clearCart();
    }, 1500);
  };
  
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
  
  const cartContent = (
    <Box sx={{ width: isMobile ? '100vw' : 400, p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h2" fontWeight={600}>
          Your Cart ({cart.totalItems} {cart.totalItems === 1 ? 'item' : 'items'})
        </Typography>
        <IconButton onClick={handleDrawerClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      {cart.items.length === 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1, gap: 2 }}>
          <ShoppingCartIcon sx={{ fontSize: 64, color: 'text.disabled' }} />
          <Typography variant="body1" color="text.secondary" align="center">
            Your cart is empty
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            Add some products to your cart to see them here
          </Typography>
          <Button 
            variant="outlined" 
            onClick={handleDrawerClose}
            sx={{ mt: 2 }}
          >
            Continue Shopping
          </Button>
        </Box>
      ) : (
        <>
          <List sx={{ flexGrow: 1, overflow: 'auto' }}>
            {cart.items.map((item) => (
              <React.Fragment key={item._id}>
                <ListItem
                  alignItems="flex-start"
                  secondaryAction={
                    <IconButton 
                      edge="end" 
                      aria-label="delete"
                      onClick={() => updateQuantity(item._id, 0)}
                      sx={{ color: theme.palette.error.main }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                  sx={{ py: 2 }}
                >
                  <ListItemAvatar>
                    <Avatar 
                      variant="rounded"
                      src={getImageUrl(item)} 
                      alt={item.name}
                      sx={{ width: 60, height: 60, borderRadius: '8px', mr: 1 }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography
                        variant="subtitle1"
                        sx={{ 
                          fontWeight: 600,
                          mb: 0.5,
                          display: '-webkit-box',
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {item.name}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          ${item.price.toFixed(2)} each
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <IconButton 
                            size="small" 
                            onClick={() => removeFromCart(item)}
                            disabled={item.quantity <= 1}
                            sx={{ p: 0.5 }}
                          >
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                          
                          <TextField
                            size="small"
                            value={item.quantity}
                            onChange={(e) => {
                              const newValue = parseInt(e.target.value) || 0;
                              if (newValue >= 0) {
                                updateQuantity(item._id, newValue);
                              }
                            }}
                            inputProps={{ 
                              min: 1, 
                              style: { textAlign: 'center', padding: '4px', width: '40px' } 
                            }}
                            variant="outlined"
                            sx={{ mx: 1 }}
                          />
                          
                          <IconButton 
                            size="small" 
                            onClick={() => addToCart(item)}
                            sx={{ p: 0.5 }}
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                          
                          <Typography variant="body2" fontWeight={600} sx={{ ml: 'auto' }}>
                            ${(item.price * item.quantity).toFixed(2)}
                          </Typography>
                        </Box>
                      </>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>
          
          <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body1" color="text.secondary">
                Subtotal:
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                ${cart.totalPrice.toFixed(2)}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body1" color="text.secondary">
                Shipping:
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                Free
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, mb: 3 }}>
              <Typography variant="h6">
                Total:
              </Typography>
              <Typography variant="h6" fontWeight={700} color="primary">
                ${cart.totalPrice.toFixed(2)}
              </Typography>
            </Box>
            
            <Button 
              variant="contained" 
              fullWidth 
              size="large"
              onClick={handleCheckoutOpen}
              sx={{ mb: 2 }}
            >
              Checkout
            </Button>
            
            <Button 
              variant="outlined" 
              fullWidth
              onClick={handleDrawerClose}
            >
              Continue Shopping
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
  
  return (
    <>
      <Tooltip title="Shopping Cart">
        <IconButton color="primary" onClick={handleDrawerOpen}>
          <Badge badgeContent={cart.totalItems} color="secondary">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
      </Tooltip>
      
      <Drawer
        anchor={isMobile ? 'bottom' : 'right'}
        open={drawerOpen}
        onClose={handleDrawerClose}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? '16px 16px 0 0' : 0,
            height: isMobile ? '90vh' : '100%'
          }
        }}
      >
        {cartContent}
      </Drawer>
      
      {/* Checkout Dialog */}
      <Dialog
        open={checkoutDialogOpen}
        onClose={checkoutSuccess ? handleCheckoutClose : null}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {checkoutSuccess ? 'Order Confirmed' : 'Checkout'}
          {!checkoutLoading && !checkoutSuccess && (
            <IconButton
              aria-label="close"
              onClick={handleCheckoutClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>
        
        <DialogContent>
          {checkoutLoading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 3 }}>
              <CircularProgress size={60} sx={{ mb: 2 }} />
              <Typography variant="body1">
                Processing your order...
              </Typography>
            </Box>
          ) : checkoutSuccess ? (
            <Box sx={{ textAlign: 'center', my: 3 }}>
              <Box sx={{ 
                borderRadius: '50%', 
                bgcolor: theme.palette.success.light, 
                width: 80, 
                height: 80, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                mx: 'auto',
                mb: 2
              }}>
                <Typography variant="h4" color="white">✓</Typography>
              </Box>
              <Typography variant="h6" gutterBottom>
                Thank you for your order!
              </Typography>
              <Typography variant="body1" paragraph>
                Your order has been placed successfully. You will receive an email confirmation shortly.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Order Total: ${cart.totalPrice.toFixed(2)}
              </Typography>
            </Box>
          ) : (
            <>
              {checkoutError && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {checkoutError}
                </Alert>
              )}
              
              <Typography variant="body1" paragraph>
                Please confirm your order:
              </Typography>
              
              <List disablePadding>
                {cart.items.map((item) => (
                  <ListItem key={item._id} sx={{ px: 0, py: 1 }}>
                    <ListItemText
                      primary={item.name}
                      secondary={`Quantity: ${item.quantity}`}
                    />
                    <Typography variant="body2" fontWeight={600}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </ListItem>
                ))}
                
                <Divider sx={{ my: 2 }} />
                
                <ListItem sx={{ px: 0 }}>
                  <ListItemText primary={<Typography variant="subtitle1">Total</Typography>} />
                  <Typography variant="subtitle1" fontWeight={700}>
                    ${cart.totalPrice.toFixed(2)}
                  </Typography>
                </ListItem>
              </List>
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 3, fontStyle: 'italic' }}>
                This is a demo checkout. No payment information is required and no actual orders will be processed.
              </Typography>
            </>
          )}
        </DialogContent>
        
        {!checkoutLoading && (
          <DialogActions sx={{ px: 3, pb: 3 }}>
            {checkoutSuccess ? (
              <Button 
                variant="contained" 
                onClick={handleCheckoutClose} 
                fullWidth
              >
                Continue Shopping
              </Button>
            ) : (
              <>
                <Button 
                  onClick={handleCheckoutClose} 
                  disabled={checkoutLoading}
                >
                  Cancel
                </Button>
                <Button 
                  variant="contained" 
                  onClick={handleCheckout} 
                  disabled={checkoutLoading}
                >
                  Confirm Order
                </Button>
              </>
            )}
          </DialogActions>
        )}
      </Dialog>
    </>
  );
};

export default ShoppingCart;