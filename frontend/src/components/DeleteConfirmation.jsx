import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

const DeleteConfirmation = ({ 
  open, 
  handleClose, 
  title, 
  message, 
  onConfirm, 
  loading, 
  error 
}) => {
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon color="error" />
          <Typography variant="h6" component="div">
            {title || 'Confirm Deletion'}
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Typography variant="body1">
          {message || 'Are you sure you want to delete this item? This action cannot be undone.'}
        </Typography>
        
        {error && (
          <Box sx={{ mt: 2, p: 1, bgcolor: 'error.light', borderRadius: 1 }}>
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button 
          onClick={handleClose} 
          disabled={loading}
        >
          Cancel
        </Button>
        
        <Button 
          onClick={onConfirm} 
          variant="contained" 
          color="error" 
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} color="inherit" />}
        >
          {loading ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmation; 