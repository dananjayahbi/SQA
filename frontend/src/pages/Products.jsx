import React from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, CardMedia, Button, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const productData = [
  {
    id: 1,
    name: 'Apple Watch Series 4',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=300&auto=format',
    category: 'Digital Product',
    price: 690.00
  },
  {
    id: 2,
    name: 'Microsoft Headsquare',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=300&auto=format',
    category: 'Digital Product',
    price: 190.00
  },
  {
    id: 3,
    name: 'Women\'s Dress',
    image: 'https://images.unsplash.com/photo-1534445538923-ab323761bda2?q=80&w=300&auto=format',
    category: 'Fashion',
    price: 640.00
  },
  {
    id: 4,
    name: 'Samsung A50',
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=300&auto=format',
    category: 'Mobile',
    price: 400.00
  },
];

const Products = () => {
  const theme = useTheme();

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
        >
          Add Product
        </Button>
      </Box>

      <Grid container spacing={3}>
        {productData.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <Card 
              sx={{ 
                borderRadius: '14px',
                overflow: 'hidden',
                boxShadow: 'none',
                border: '1px solid',
                borderColor: theme.palette.divider,
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={product.image}
                alt={product.name}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {product.category}
                </Typography>
                <Typography variant="h6" component="div" sx={{ fontWeight: 600, mb: 1 }}>
                  {product.name}
                </Typography>
                <Typography variant="body1" color="primary" fontWeight={600}>
                  ${product.price.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Products; 