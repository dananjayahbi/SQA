import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
  Stack,
  Paper,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import StorefrontIcon from '@mui/icons-material/Storefront';

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Featured categories for the homepage
  const featuredCategories = [
    {
      name: 'Electronics',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80',
      link: '/store/products?category=electronics',
    },
    {
      name: 'Clothing',
      image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80',
      link: '/store/products?category=clothing',
    },
    {
      name: 'Home & Kitchen',
      image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80',
      link: '/store/products?category=home',
    },
  ];

  // Features section
  const features = [
    {
      icon: <LocalShippingIcon sx={{ fontSize: 40 }} />,
      title: 'Free Shipping',
      description: 'On all orders over $50',
    },
    {
      icon: <CreditCardIcon sx={{ fontSize: 40 }} />,
      title: 'Secure Payment',
      description: 'Safe & secure checkout',
    },
    {
      icon: <SupportAgentIcon sx={{ fontSize: 40 }} />,
      title: '24/7 Support',
      description: 'Dedicated support team',
    },
    {
      icon: <ShoppingBagIcon sx={{ fontSize: 40 }} />,
      title: 'Easy Returns',
      description: '30-day return policy',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: theme.palette.primary.main,
          color: 'white',
          pt: { xs: 8, md: 12 },
          pb: { xs: 8, md: 12 },
        }}
      >
        <Container>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h3"
                component="h1"
                fontWeight={700}
                gutterBottom
                data-testid="hero-title"
              >
                Quality Products for Everyone
              </Typography>
              <Typography variant="h6" paragraph sx={{ mb: 4, opacity: 0.9 }}>
                Discover our wide range of products at competitive prices. Shop now and enjoy fast delivery and excellent customer service.
              </Typography>
              <Button
                variant="contained"
                size="large"
                component={Link}
                to="/store/products"
                color="secondary"
                startIcon={<StorefrontIcon />}
                sx={{
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  boxShadow: 4,
                }}
                data-testid="shop-now-button"
              >
                Shop Now
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1607082349566-187342175e2f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
                alt="Shopping"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 4,
                  boxShadow: 6,
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: 6 }}>
        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  borderRadius: 2,
                  transition: 'all 0.3s',
                  border: '1px solid',
                  borderColor: 'divider',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 3,
                  },
                }}
              >
                <Box sx={{ color: 'primary.main', mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Featured Categories Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 6 }}>
        <Container>
          <Typography
            variant="h4"
            component="h2"
            fontWeight={700}
            gutterBottom
            textAlign="center"
            sx={{ mb: 5 }}
            data-testid="featured-categories-title"
          >
            Featured Categories
          </Typography>

          <Grid container spacing={4}>
            {featuredCategories.map((category, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  component={Link}
                  to={category.link}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    textDecoration: 'none',
                    borderRadius: 2,
                    overflow: 'hidden',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={category.image}
                    alt={category.name}
                  />
                  <CardContent
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="h6" fontWeight={600}>
                      {category.name}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 8 }}>
        <Container>
          <Paper
            sx={{
              p: { xs: 3, md: 5 },
              borderRadius: 3,
              backgroundImage: 'linear-gradient(135deg, #4dabf5 10%, #2196f3 100%)',
              color: 'white',
              textAlign: 'center',
            }}
          >
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Ready to Shop?
            </Typography>
            <Typography variant="body1" paragraph sx={{ maxWidth: 800, mx: 'auto', mb: 4, opacity: 0.9 }}>
              Browse our full catalog of quality products at competitive prices. 
              Join thousands of satisfied customers today!
            </Typography>
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/store/products"
              color="secondary"
              sx={{
                fontWeight: 600,
                px: 4,
                py: 1.5,
                borderRadius: 2,
                boxShadow: 4,
                '&:hover': {
                  boxShadow: 6,
                  transform: 'translateY(-2px)',
                },
              }}
              data-testid="browse-products-button"
            >
              Browse Products
            </Button>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;