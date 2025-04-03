import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  IconButton, 
  Divider,
  Button,
  useTheme,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { categoryAPI } from '../utils/api';
import CategoryForm from '../components/CategoryForm';
import DeleteConfirmation from '../components/DeleteConfirmation';

const ProductCategory = () => {
  const theme = useTheme();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  const fetchCategories = async () => {
    setLoading(true);
    setError('');
    
    try {
      const data = await categoryAPI.getAll();
      setCategories(data);
    } catch (err) {
      setError('Failed to load categories. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddClick = () => {
    setSelectedCategory(null);
    setFormOpen(true);
  };

  const handleEditClick = (category) => {
    setSelectedCategory(category);
    setFormOpen(true);
  };

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
    setDeleteError('');
  };

  const handleFormClose = () => {
    setFormOpen(false);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
    setDeleteError('');
  };

  const handleCategoryDelete = async () => {
    if (!categoryToDelete) return;
    
    setDeleteLoading(true);
    setDeleteError('');
    
    try {
      await categoryAPI.delete(categoryToDelete._id);
      await fetchCategories();
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
      setNotification({
        open: true,
        message: 'Category deleted successfully',
        severity: 'success'
      });
    } catch (err) {
      setDeleteError(err.message || 'Failed to delete category');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleNotificationClose = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Box>
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleNotificationClose} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
      
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
          Product Categories
        </Typography>
        
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          sx={{ borderRadius: '8px', px: 3 }}
          onClick={handleAddClick}
        >
          Add Category
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper 
        sx={{
          borderRadius: '14px',
          overflow: 'hidden',
          boxShadow: 'none',
          border: '1px solid',
          borderColor: theme.palette.divider,
          position: 'relative',
          minHeight: '200px'
        }}
      >
        {loading ? (
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              height: '200px'
            }}
          >
            <CircularProgress />
          </Box>
        ) : categories.length === 0 ? (
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              height: '200px',
              flexDirection: 'column',
              gap: 2
            }}
          >
            <Typography variant="body1" color="text.secondary">
              No categories found
            </Typography>
            <Button 
              variant="outlined" 
              startIcon={<AddIcon />}
              onClick={handleAddClick}
            >
              Add Your First Category
            </Button>
          </Box>
        ) : (
          <List disablePadding>
            {categories.map((category, index) => (
              <React.Fragment key={category._id}>
                {index > 0 && <Divider />}
                <ListItem
                  secondaryAction={
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton 
                        edge="end" 
                        aria-label="edit" 
                        sx={{ color: theme.palette.text.primary, opacity: 0.6 }}
                        onClick={() => handleEditClick(category)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        edge="end" 
                        aria-label="delete" 
                        sx={{ color: theme.palette.error.main }}
                        onClick={() => handleDeleteClick(category)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                  sx={{ py: 2 }}
                >
                  <ListItemIcon>
                    <Box 
                      sx={{ 
                        width: 40, 
                        height: 40, 
                        borderRadius: '8px', 
                        backgroundColor: `${theme.palette.primary.main}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <CategoryIcon color="primary" />
                    </Box>
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Typography variant="body2" fontWeight={600}>
                        {category.name}
                      </Typography>
                    } 
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        {category.productCount || 0} products
                      </Typography>
                    }
                  />
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>

      {/* Category Form Dialog */}
      <CategoryForm 
        open={formOpen} 
        handleClose={handleFormClose} 
        category={selectedCategory} 
        refreshCategories={fetchCategories} 
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmation 
        open={deleteDialogOpen}
        handleClose={handleDeleteDialogClose}
        title="Delete Category"
        message={`Are you sure you want to delete "${categoryToDelete?.name}"? This action cannot be undone.`}
        onConfirm={handleCategoryDelete}
        loading={deleteLoading}
        error={deleteError}
      />
    </Box>
  );
};

export default ProductCategory; 