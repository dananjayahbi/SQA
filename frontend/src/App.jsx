import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { CssBaseline } from '@mui/material';
import theme from './styles/theme';
import { CartProvider } from './contexts/CartContext';

// Pages - Admin Dashboard
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import ProductCategory from './pages/ProductCategory';
import ProductStore from './pages/ProductStore';
import Settings from './pages/Settings';
import Feedback from './pages/Feedback';

// Pages - Storefront
import Home from './pages/Home';
import ProductsPage from './pages/ProductsPage';
import ProductDetail from './pages/ProductDetail';
import AboutUs from './pages/AboutUs';

// Layouts
import Layout from './components/Layout';
import StorefrontLayout from './components/StorefrontLayout';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="categories" element={<ProductCategory />} />
          <Route path="settings" element={<Settings />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      <CartProvider>
        <Routes>
          {/* Admin Dashboard Routes */}
          <Route path="/dashboard" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="categories" element={<ProductCategory />} />
            <Route path="store" element={<ProductStore />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          
          {/* Storefront Routes */}
          <Route path="/" element={<StorefrontLayout />}>
            <Route index element={<Navigate to="/store" replace />} />
            <Route path="store" element={<Home />} />
            <Route path="store/products" element={<ProductsPage />} />
            <Route path="store/products/:id" element={<ProductDetail />} />
            <Route path="store/about" element={<AboutUs />} />
          </Route>
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/store" replace />} />
        </Routes>
      </CartProvider>
    </ThemeProvider>
  );
};

export default App;