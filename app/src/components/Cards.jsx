import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import Button from './Button';
import './style.css';

function ProductCard({img}) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedColor, setSelectedColor] = useState('navy');

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div className="d-flex justify-content-center">
      <Card style={{ width: '20rem' }} className="product-card shadow-lg">
        <div className="product-img-container position-relative">
          <div className="d-flex justify-content-center align-items-center p-3">
            <Card.Img 
              variant="top" 
              src={img} 
              alt="Casual Shirt" 
              className="product-img"
            />
          </div>
          <button 
            className={`wishlist-btn position-absolute border-0 ${isWishlisted ? 'text-danger' : 'text-secondary'}`}
            onClick={toggleWishlist}
          >
            <i className={`bi ${isWishlisted ? 'bi-heart-fill' : 'bi-heart'}`}></i>
          </button>
          <div className="discount-badge position-absolute">25% OFF</div>
        </div>
        
        <Card.Body className="position-relative">
          <Card.Title className="product-title">Premium Casual Shirt</Card.Title>
          
          <div className="product-price mb-2">
            <span className="current-price">
              <i className="bi bi-currency-rupee"></i>
              <span>2,249</span>
            </span>
            <span className="original-price">
              <i className="bi bi-currency-rupee"></i>
              <span>2,999</span>
            </span>
          </div>
          
          <div className="rating mb-2">
            <div className="rating-stars">
              <i className="bi bi-star-fill text-warning"></i>
              <i className="bi bi-star-fill text-warning"></i>
              <i className="bi bi-star-fill text-warning"></i>
              <i className="bi bi-star-fill text-warning"></i>
              <i className="bi bi-star-half text-warning"></i>
            </div>
            <span className="rating-count ms-2">(128 reviews)</span>
          </div>
          
          <div className="product-colors mb-3">
            <span className="me-2">Colors:</span>
            <div 
              className={`color-option ${selectedColor === 'navy' ? 'active' : ''}`}
              style={{backgroundColor: '#2c3e50'}}
              onClick={() => setSelectedColor('navy')}
            ></div>
            <div 
              className={`color-option ${selectedColor === 'maroon' ? 'active' : ''}`}
              style={{backgroundColor: '#8B0000'}}
              onClick={() => setSelectedColor('maroon')}
            ></div>
            <div 
              className={`color-option ${selectedColor === 'green' ? 'active' : ''}`}
              style={{backgroundColor: '#006400'}}
              onClick={() => setSelectedColor('green')}
            ></div>
          </div>
          
          <div className="d-grid justify-content-center">
            <Button buttonname="Add to Cart" variant="outline-primary" bgcolor="#00416A" color="white" />
            {/* <Button buttonname="Buy Now" /> */}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default ProductCard;