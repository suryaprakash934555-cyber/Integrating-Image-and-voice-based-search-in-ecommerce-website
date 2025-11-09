import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import './style.css';

function ProductCard({ img }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedColor, setSelectedColor] = useState('navy');
  const [selectedSize, setSelectedSize] = useState('M'); // Added size selection
  const navigate = useNavigate();

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  // Mock product data
  const product = {
    id: 'prod_001',
    name: "Premium Cotton Casual Shirt",
    price: 29.99,
    mrp: 39.99,
    description: "This premium cotton casual shirt is made from 100% organic cotton. It features a comfortable fit, durable construction, and is perfect for everyday wear.",
    features: [
      "100% Organic Cotton",
      "Machine Washable",
      "Pre-shrunk",
      "Breathable Fabric",
      "Eco-friendly"
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'navy', value: '#2c3e50' },
      { name: 'maroon', value: '#8B0000' },
      { name: 'green', value: '#006400' },
      { name: 'charcoal', value: '#36454F' }
    ],
    images: [img],
    category: "Shirts",
    style: "Casual",
    rating: 4.5,
    reviewCount: 128,
    inStock: true,
    sku: 'SH001-NAVY'
  };

  const handleBuyNow = () => {
    // Calculate total amount in cents
    const amount = Math.round(product.price * 100);
    
    // Generate mock order ID
    const orderId = `ORD_${Date.now()}`;
    
    // Generate mock client secret (for demo purposes)
    const mockClientSecret = `pi_3P9${Date.now()}ABCDEF_secret_${Math.random().toString(36).substr(2, 9)}`;

    // Navigate to payment page with all necessary data
    navigate('/payment', {
      state: {
        productDetails: {
          ...product,
          selectedColor,
          selectedSize,
          quantity: 1
        },
        clientSecret: mockClientSecret,
        orderId: orderId,
        amount: amount,
        customerEmail: 'customer@example.com' // You can make this dynamic
      }
    });
  };

  const handleAddToCart = () => {
    const cartItem = {
      ...product,
      selectedColor,
      selectedSize,
      quantity: 1
    };
    
    // Your cart logic here
    // addToCart(cartItem);
    
    alert('Product added to cart!');
  };

  return (
    <div className="d-flex justify-content-center">
      <Card style={{ width: '18rem' }} className="product-card shadow-sm border-0">
        <div className="product-img-container position-relative overflow-hidden">
          <div className="d-flex justify-content-center align-items-center p-3">
            <Card.Img 
              variant="top" 
              src={img} 
              alt="Casual Shirt" 
              className="product-img transition-all"
              style={{ height: '180px', objectFit: 'contain' }}
            />
          </div>
          
          {/* Wishlist Button */}
          <button 
            className={`wishlist-btn position-absolute top-0 end-0 m-2 border-0 rounded-circle p-1 ${
              isWishlisted ? 'bg-danger text-white' : 'bg-light text-dark'
            } shadow-sm transition-all`}
            onClick={toggleWishlist}
            style={{ width: '32px', height: '32px' }}
          >
            <i className={`bi ${isWishlisted ? 'bi-heart-fill' : 'bi-heart'}`} style={{ fontSize: '0.9rem' }}></i>
          </button>
          
          {/* Discount Badge */}
          <div className="discount-badge position-absolute top-0 start-0 m-2 bg-dark text-white px-1 py-1">
            <span className="small fw-medium" style={{ fontSize: '0.7rem' }}>25% OFF</span>
          </div>
        </div>
        
        <Card.Body className="position-relative p-3">
          {/* Product Title */}
          <Card.Title className="product-title fw-semibold mb-1 fs-6 text-dark lh-sm" style={{ fontSize: '0.95rem' }}>
            {product.name}
          </Card.Title>
          
          {/* Brand */}
          <div className="product-brand mb-2">
            <span className="text-muted small text-uppercase tracking-wide" style={{ fontSize: '0.7rem' }}>ELEGANCE WEAR</span>
          </div>
          
          {/* Price Section */}
          <div className="product-price mb-2">
            <span className="current-price fw-bold text-dark" style={{ fontSize: '1.1rem' }}>
              ${product.price}
            </span>
            <span className="original-price text-muted text-decoration-line-through ms-1 small" style={{ fontSize: '0.8rem' }}>
              ${product.mrp}
            </span>
            <span className="discount-amount text-success fw-medium ms-1 small" style={{ fontSize: '0.75rem' }}>
              Save ${(product.mrp - product.price).toFixed(2)}
            </span>
          </div>
          
          {/* Rating Section */}
          <div className="rating mb-2 d-flex align-items-center">
            <div className="rating-stars d-flex align-items-center">
              <div className="bg-warning text-white small px-1 py-1 rounded me-1 d-flex align-items-center" style={{ fontSize: '0.7rem' }}>
                <span className="fw-bold">{product.rating}</span>
                <i className="bi bi-star-fill ms-1" style={{ fontSize: '0.6rem' }}></i>
              </div>
              <div className="rating-icons">
                {[1, 2, 3, 4, 5].map((star) => (
                  <i 
                    key={star}
                    className={`bi ${
                      star <= Math.floor(product.rating) 
                        ? 'bi-star-fill text-warning' 
                        : star === Math.ceil(product.rating) && !Number.isInteger(product.rating)
                        ? 'bi-star-half text-warning'
                        : 'bi-star text-warning'
                    } me-1`}
                    style={{ fontSize: '0.8rem' }}
                  ></i>
                ))}
              </div>
            </div>
            <span className="rating-count text-muted ms-1 small" style={{ fontSize: '0.75rem' }}>({product.reviewCount})</span>
          </div>

          {/* Size Selection */}
          <div className="size-selection mb-2">
            <span className="text-dark small fw-medium mb-1 d-block" style={{ fontSize: '0.8rem' }}>
              Size: <span className="text-capitalize ms-1">{selectedSize}</span>
            </span>
            <div className="d-flex gap-1">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  className={`size-option border rounded px-2 py-1 ${
                    selectedSize === size ? 'bg-dark text-white' : 'bg-light text-dark'
                  }`}
                  style={{ fontSize: '0.7rem' }}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          
          {/* Color Options */}
          <div className="product-colors mb-3">
            <span className="text-dark small fw-medium mb-1 d-block" style={{ fontSize: '0.8rem' }}>Color: 
              <span className="text-capitalize ms-1">{selectedColor}</span>
            </span>
            <div className="d-flex gap-1">
              {product.colors.map((colorOption) => (
                <div 
                  key={colorOption.name}
                  className={`color-option rounded-circle border cursor-pointer transition-all ${
                    selectedColor === colorOption.name ? 'border-dark' : 'border-light'
                  }`}
                  style={{
                    backgroundColor: colorOption.value,
                    width: '20px',
                    height: '20px'
                  }}
                  onClick={() => setSelectedColor(colorOption.name)}
                  title={colorOption.name}
                >
                  {selectedColor === colorOption.name && (
                    <div className="position-absolute top-50 start-50 translate-middle">
                      <i className="bi bi-check text-white" style={{ fontSize: '0.7rem' }}></i>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="d-flex gap-2">
            <Button 
              buttonname="Add to Cart" 
              variant="outline-dark" 
              className="flex-fill py-1 rounded-1 fw-medium border transition-all"
              style={{ fontSize: '0.8rem' }}
              onClick={handleAddToCart}
            />
            <Button 
              buttonname="Buy Now" 
              variant="dark"
              className="flex-fill py-1 rounded-1 fw-medium transition-all"
              style={{ fontSize: '0.8rem' }}
              onClick={handleBuyNow}
            />
          </div>
          
          {/* Product Features */}
          <div className="product-features mt-2 pt-2 border-top">
            <div className="row g-1 text-center">
              <div className="col-4">
                <div className="feature-item">
                  <i className="bi bi-truck text-muted d-block mb-1" style={{ fontSize: '0.9rem' }}></i>
                  <span className="text-muted small" style={{ fontSize: '0.7rem' }}>Free Delivery</span>
                </div>
              </div>
              <div className="col-4">
                <div className="feature-item">
                  <i className="bi bi-arrow-repeat text-muted d-block mb-1" style={{ fontSize: '0.9rem' }}></i>
                  <span className="text-muted small" style={{ fontSize: '0.7rem' }}>30 Days Return</span>
                </div>
              </div>
              <div className="col-4">
                <div className="feature-item">
                  <i className="bi bi-shield-check text-muted d-block mb-1" style={{ fontSize: '0.9rem' }}></i>
                  <span className="text-muted small" style={{ fontSize: '0.7rem' }}>Warranty</span>
                </div>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default ProductCard;