import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';

const AboutUs = () => {
  const theme = useTheme();

  // Company values
  const values = [
    {
      title: 'Quality',
      description: 'We ensure all our products meet the highest standards of quality.',
      icon: <ThumbUpAltIcon fontSize="large" color="primary" />,
    },
    {
      title: 'Customer Satisfaction',
      description: 'We put our customers first and strive to exceed their expectations.',
      icon: <SupportAgentIcon fontSize="large" color="primary" />,
    },
    {
      title: 'Reliability',
      description: 'Fast shipping and dependable service you can count on.',
      icon: <LocalShippingIcon fontSize="large" color="primary" />,
    },
  ];

  // Team members
  const team = [
    {
      name: 'John Smith',
      position: 'CEO & Founder',
      image: 'https://randomuser.me/api/portraits/men/42.jpg',
      bio: 'John has over 15 years of experience in retail and e-commerce.',
    },
    {
      name: 'Emily Johnson',
      position: 'Chief Product Officer',
      image: 'https://randomuser.me/api/portraits/women/22.jpg',
      bio: 'Emily oversees our product selection and quality control processes.',
    },
    {
      name: 'Michael Brown',
      position: 'Head of Customer Service',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      bio: 'Michael ensures our customers receive exceptional support.',
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
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" component="h1" gutterBottom fontWeight={700} data-testid="about-us-title">
            About SQA Store
          </Typography>
          <Typography variant="h6" paragraph sx={{ maxWidth: 800, mx: 'auto' }}>
            We're dedicated to providing our customers with the best shopping experience possible.
            Learn more about our company, our mission, and the team behind it all.
          </Typography>
        </Container>
      </Box>

      {/* Our Story Section */}
      <Container sx={{ py: 8 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h2" gutterBottom fontWeight={600}>
              Our Story
            </Typography>
            <Typography variant="body1" paragraph>
              Founded in 2020, SQA Store started with a simple mission: to provide
              high-quality products at competitive prices with exceptional customer service.
            </Typography>
            <Typography variant="body1" paragraph>
              What began as a small online shop has grown into a trusted e-commerce destination
              serving thousands of satisfied customers. We remain committed to our original
              values while continually expanding our product offerings and improving our services.
            </Typography>
            <Typography variant="body1">
              Today, we offer a wide range of products across multiple categories, from electronics
              to home goods, all carefully selected for their quality and value.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
              alt="Our team"
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: 2,
                boxShadow: 3,
              }}
              data-testid="about-us-image"
            />
          </Grid>
        </Grid>
      </Container>

      {/* Our Values Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container>
          <Typography
            variant="h4"
            component="h2"
            textAlign="center"
            gutterBottom
            fontWeight={600}
            sx={{ mb: 6 }}
          >
            Our Values
          </Typography>

          <Grid container spacing={4}>
            {values.map((value, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
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
                  <Box sx={{ mb: 2 }}>{value.icon}</Box>
                  <Typography variant="h5" component="h3" gutterBottom fontWeight={600}>
                    {value.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {value.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Why Choose Us Section */}
      <Container sx={{ py: 8 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h2" gutterBottom fontWeight={600}>
              Why Choose Us
            </Typography>
            <Typography variant="body1" paragraph>
              At SQA Store, we differentiate ourselves through our commitment to:
            </Typography>
            <List>
              {[
                'Carefully curated selection of high-quality products',
                'Competitive pricing with no hidden fees',
                'Fast and reliable shipping options',
                'Responsive customer service team',
                'Easy returns and exchanges',
                'Secure shopping experience',
              ].map((item, index) => (
                <ListItem key={index} sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1556742111-a301076d9d18?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
              alt="Warehouse"
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: 2,
                boxShadow: 3,
              }}
            />
          </Grid>
        </Grid>
      </Container>

      {/* Our Team Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container>
          <Typography
            variant="h4"
            component="h2"
            textAlign="center"
            gutterBottom
            fontWeight={600}
            sx={{ mb: 6 }}
          >
            Meet Our Team
          </Typography>

          <Grid container spacing={4}>
            {team.map((member, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 2,
                    overflow: 'hidden',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 3,
                    },
                  }}
                >
                  <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar
                      src={member.image}
                      alt={member.name}
                      sx={{ width: 120, height: 120, mb: 2 }}
                    />
                    <Typography variant="h6" component="h3" fontWeight={600} align="center">
                      {member.name}
                    </Typography>
                    <Typography variant="subtitle1" color="primary" align="center" gutterBottom>
                      {member.position}
                    </Typography>
                  </Box>
                  <Divider />
                  <CardContent sx={{ flexGrow: 1, bgcolor: 'background.paper' }}>
                    <Typography variant="body2" color="text.secondary">
                      {member.bio}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default AboutUs;