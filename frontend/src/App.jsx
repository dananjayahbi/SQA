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

// Pages
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import ProductCategory from './pages/ProductCategory';
import ProductStore from './pages/ProductStore';
import Settings from './pages/Settings';

// Components
import Layout from './components/Layout';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CartProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="store" element={<ProductStore />} />
            <Route path="products" element={<Products />} />
            <Route path="categories" element={<ProductCategory />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </CartProvider>
    </ThemeProvider>
  );
};

export default App;