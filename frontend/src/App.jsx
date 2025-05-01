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
import Register from './pages/Register';
import Login from './pages/login';
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
    <div>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CartProvider>
        <Routes>
          {/* Admin Dashboard Routes */}
          <Route path="/dashboard" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="categories" element={<ProductCategory />} />
            <Route path="store" element={<ProductStore />} />
            <Route path="settings" element={<Settings />} />
            <Route path="register" element={<Register />} />
          </Route>

          {/* Storefront Routes */}
          <Route path="/" element={<StorefrontLayout />}>
            <Route index element={<Navigate to="/store" replace />} />
            <Route path="store" element={<Home />} />
            <Route path="store/products" element={<ProductsPage />} />
            <Route path="store/products/:id" element={<ProductDetail />} />
            <Route path="store/about" element={<AboutUs />} />
            <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />
          </Route>

          {/* Additional Routes */}
          <Route path="/feedback" element={<Feedback />} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/store" replace />} />
        </Routes>
      </CartProvider>
    </ThemeProvider>
    {/* Newsletter Signup */}
    <section style={{ padding: '60px 20px', backgroundColor: '#1a2a44', color: '#fff', textAlign: 'center' }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '20px' }}>Join Our Newsletter</h2>
      <p style={{ fontSize: '18px', marginBottom: '30px' }}>
        Stay updated with the latest deals and exclusive offers!
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', maxWidth: '500px', margin: '0 auto' }}>
        <input
          type="email"
          placeholder="Enter your email"
          style={{
            padding: '12px',
            fontSize: '16px',
            borderRadius: '5px',
            border: 'none',
            width: '70%',
            boxSizing: 'border-box'
          }}
        />
        <button
          style={{
            padding: '12px 20px',
            backgroundColor: '#ffd700',
            color: '#1a2a44',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background-color 0.3s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#e6c200'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#ffd700'}
        >
          Subscribe
        </button>
      </div>
    </div>
  </section>

  {/* Footer */}
  <footer style={{ backgroundColor: '#1a2a44', color: '#fff', padding: '40px 20px' }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px' }}>
      <div>
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px' }}>About ShopElite</h3>
        <p style={{ fontSize: '14px', color: '#ccc' }}>
          ShopElite offers premium products with a focus on quality, style, and customer satisfaction.
        </p>
      </div>
      <div>
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px' }}>Quick Links</h3>
        <ul style={{ listStyle: 'none', padding: 0, fontSize: '14px', color: '#ccc' }}>
          <li style={{ marginBottom: '10px' }}><a href="/shop" style={{ color: '#ccc', textDecoration: 'none', transition: 'color 0.3s' }} onMouseOver={(e) => e.target.style.color = '#ffd700'} onMouseOut={(e) => e.target.style.color = '#ccc'}>Shop</a></li>
          <li style={{ marginBottom: '10px' }}><a href="/about" style={{ color: '#ccc', textDecoration: 'none', transition: 'color 0.3s' }} onMouseOver={(e) => e.target.style.color = '#ffd700'} onMouseOut={(e) => e.target.style.color = '#ccc'}>About</a></li>
          <li style={{ marginBottom: '10px' }}><a href="/contact" style={{ color: '#ccc', textDecoration: 'none', transition: 'color 0.3s' }} onMouseOver={(e) => e.target.style.color = '#ffd700'} onMouseOut={(e) => e.target.style.color = '#ccc'}>Contact</a></li>
          <li><a href="/faq" style={{ color: '#ccc', textDecoration: 'none', transition: 'color 0.3s' }} onMouseOver={(e) => e.target.style.color = '#ffd700'} onMouseOut={(e) => e.target.style.color = '#ccc'}>FAQ</a></li>
        </ul>
      </div>
      <div>
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px' }}>Contact Us</h3>
        <p style={{ fontSize: '14px', color: '#ccc', marginBottom: '10px' }}>Email: support@shopelite.com</p>
        <p style={{ fontSize: '14px', color: '#ccc', marginBottom: '10px' }}>Phone: (123) 456-7890</p>
        <p style={{ fontSize: '14px', color: '#ccc' }}>Address: 123 Elite St, Shop City</p>
      </div>
    </div>
    <div style={{ textAlign: 'center', marginTop: '30px', fontSize: '14px', color: '#ccc' }}>
      © {new Date().getFullYear()} ShopElite. All rights reserved.
    </div>
  </footer>
  </div>
  );
};

export default App;