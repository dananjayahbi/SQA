import React from 'react';

const Dashboard = () => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', margin: 0, padding: 0 }}>
      {/* Navigation Bar */}
      <nav style={{
        backgroundColor: '#1a2a44',
        padding: '15px 0',
        position: 'fixed',
        width: '100%',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 20px'
        }}>
          <h1 style={{ color: '#ffd700', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>ShopElite</h1>
          <ul style={{
            listStyle: 'none',
            display: 'flex',
            gap: '20px',
            margin: 0,
            padding: 0
          }}>
            <li><a href="/home" style={{ color: '#fff', textDecoration: 'none', fontSize: '16px', transition: 'color 0.3s' }} onMouseOver={(e) => e.target.style.color = '#ffd700'} onMouseOut={(e) => e.target.style.color = '#fff'}>Home</a></li>
            <li><a href="/shop" style={{ color: '#fff', textDecoration: 'none', fontSize: '16px', transition: 'color 0.3s' }} onMouseOver={(e) => e.target.style.color = '#ffd700'} onMouseOut={(e) => e.target.style.color = '#fff'}>Shop</a></li>
            <li><a href="/about" style={{ color: '#fff', textDecoration: 'none', fontSize: '16px', transition: 'color 0.3s' }} onMouseOver={(e) => e.target.style.color = '#ffd700'} onMouseOut={(e) => e.target.style.color = '#fff'}>About</a></li>
            <li><a href="/contact" style={{ color: '#fff', textDecoration: 'none', fontSize: '16px', transition: 'color 0.3s' }} onMouseOver={(e) => e.target.style.color = '#ffd700'} onMouseOut={(e) => e.target.style.color = '#fff'}>Contact</a></li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(to right, #1a2a44, #2e4a7d)',
        color: '#fff',
        padding: '100px 20px',
        textAlign: 'center',
        marginTop: '60px',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '20px' }}>Elevate Your Shopping Experience</h2>
          <p style={{ fontSize: '20px', marginBottom: '30px', maxWidth: '600px', margin: '0 auto' }}>
            Discover premium products in fashion, electronics, and home essentials with unbeatable quality.
          </p>
          <a
            href="/shop"
            style={{
              display: 'inline-block',
              backgroundColor: '#ffd700',
              color: '#1a2a44',
              padding: '15px 30px',
              borderRadius: '5px',
              textDecoration: 'none',
              fontSize: '18px',
              fontWeight: 'bold',
              transition: 'background-color 0.3s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#e6c200'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#ffd700'}
          >
            Explore Now
          </a>
        </div>
      </section>

      {/* Featured Products Section */}
      <section style={{ padding: '80px 20px', backgroundColor: '#f7f7f7' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1a2a44', marginBottom: '40px' }}>Our Top Picks</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '30px'
          }}>
            {/* Product 1 */}
            <div style={{
              backgroundColor: '#fff',
              borderRadius: '10px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
              transition: 'transform 0.3s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
              <img
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                alt="Sneakers"
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
              />
              <div style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a2a44', marginBottom: '10px' }}>Premium Sneakers</h3>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
                  Stylish and comfortable sneakers crafted for all-day wear, perfect for any occasion.
                </p>
                <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a2a44', marginBottom: '15px' }}>$59.99</p>
                <a
                  href="/product/1"
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#1a2a44',
                    color: '#fff',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    textDecoration: 'none',
                    fontSize: '16px',
                    transition: 'background-color 0.3s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#2e4a7d'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#1a2a44'}
                >
                  Add to Cart
                </a>
              </div>
            </div>

            {/* Product 2 */}
            <div style={{
              backgroundColor: '#fff',
              borderRadius: '10px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
              transition: 'transform 0.3s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                alt="Headphones"
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
              />
              <div style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a2a44', marginBottom: '10px' }}>Wireless Headphones</h3>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
                  Experience crystal-clear audio with advanced noise cancellation technology.
                </p>
                <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a2a44', marginBottom: '15px' }}>$99.99</p>
                <a
                  href="/product/2"
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#1a2a44',
                    color: '#fff',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    textDecoration: 'none',
                    fontSize: '16px',
                    transition: 'background-color 0.3s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#2e4a7d'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#1a2a44'}
                >
                  Add to Cart
                </a>
              </div>
            </div>

            {/* Product 3 */}
            <div style={{
              backgroundColor: '#fff',
              borderRadius: '10px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
              transition: 'transform 0.3s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
              <img
                src="https://images.unsplash.com/photo-1564466809058-bf4114d55352?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                alt="Smartwatch"
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
              />
              <div style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a2a44', marginBottom: '10px' }}>Smartwatch Elite</h3>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
                  Stay connected and track your fitness with our cutting-edge smartwatch.
                </p>
                <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a2a44', marginBottom: '15px' }}>$129.99</p>
                <a
                  href="/product/3"
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#1a2a44',
                    color: '#fff',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    textDecoration: 'none',
                    fontSize: '16px',
                    transition: 'background-color 0.3s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#2e4a7d'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#1a2a44'}
                >
                  Add to Cart
                </a>
              </div>
            </div>

            {/* Product 4 */}
            <div style={{
              backgroundColor: '#fff',
              borderRadius: '10px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
              transition: 'transform 0.3s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                alt="Dress"
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
              />
              <div style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a2a44', marginBottom: '10px' }}>Chic Dress</h3>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
                  Elegant and versatile dress for formal events or casual outings.
                </p>
                <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a2a44', marginBottom: '15px' }}>$79.99</p>
                <a
                  href="/product/4"
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#1a2a44',
                    color: '#fff',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    textDecoration: 'none',
                    fontSize: '16px',
                    transition: 'background-color 0.3s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#2e4a7d'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#1a2a44'}
                >
                  Add to Cart
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section style={{
        background: 'linear-gradient(to right, #ffd700, #e6c200)',
        padding: '60px 20px',
        textAlign: 'center',
        color: '#1a2a44'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '20px' }}>Exclusive Offer!</h2>
          <p style={{ fontSize: '18px', marginBottom: '30px' }}>
            Use code <strong>ELITE25</strong> to get 25% off your first order. Limited time only!
          </p>
          <a
            href="/shop"
            style={{
              display: 'inline-block',
              backgroundColor: '#1a2a44',
              color: '#fff',
              padding: '15px 30px',
              borderRadius: '5px',
              textDecoration: 'none',
              fontSize: '18px',
              fontWeight: 'bold',
              transition: 'background-color 0.3s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#2e4a7d'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#1a2a44'}
          >
            Shop Now
          </a>
        </div>
      </section>

      {/* Testimonials Section */}
      <section style={{ padding: '80px 20px', backgroundColor: '#fff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1a2a44', marginBottom: '40px' }}>What Our Customers Say</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px'
          }}>
            <div style={{
              backgroundColor: '#f7f7f7',
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
            }}>
              <p style={{ fontSize: '16px', color: '#666', marginBottom: '15px' }}>
                "ShopElite has the best selection of products! The quality is outstanding, and delivery is always on time."
              </p>
              <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#1a2a44' }}>- Sarah M.</p>
            </div>
            <div style={{
              backgroundColor: '#f7f7f7',
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
            }}>
              <p style={{ fontSize: '16px', color: '#666', marginBottom: '15px' }}>
                "I love the sleek design of their electronics. Customer service was fantastic when I had a question!"
              </p>
              <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#1a2a44' }}>- James T.</p>
            </div>
          </div>
        </div>
      </section>

      
    </div>
  );
};

export default Dashboard;