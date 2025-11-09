import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col, Button, Badge, Form, Alert, Carousel } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import Header from '../layout/Header';
import './style.css';

function ProductDetail() {
  const { productId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showAlert, setShowAlert] = useState(false);

  // Use product from navigation state or fallback to mock data
  const productFromState = location.state?.product;
  
  // Create a safe product object with fallbacks
  const product = productFromState || {
    id: productId,
    name: "Premium Cotton T-Shirt",
    price: 29.99,
    mrp: 39.99,
    description: "This premium cotton t-shirt is made from 100% organic cotton. It features a comfortable fit, durable construction, and is perfect for everyday wear.",
    features: [
      "100% Organic Cotton",
      "Machine Washable",
      "Pre-shrunk",
      "Breathable Fabric",
      "Eco-friendly"
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Black', value: '#000000' },
      { name: 'White', value: '#FFFFFF' },
      { name: 'Navy Blue', value: '#000080' },
      { name: 'Red', value: '#FF0000' }
    ],
    images: [
      '/images/tshirt1.jpg',
      '/images/tshirt2.jpg',
      '/images/tshirt3.jpg'
    ],
    category: "T-Shirts",
    style: "Casual",
    rating: 4.5,
    reviewCount: 128,
    sku: 'TS001-BLK'
  };

  // Safe array getters with fallbacks
  const safeFeatures = Array.isArray(product.features) ? product.features : [];
  const safeSizes = Array.isArray(product.sizes) ? product.sizes : [];
  const safeColors = Array.isArray(product.colors) ? product.colors : [];
  
  // Safe images handling
  const getProductImages = () => {
    if (productFromState) {
      // If we have product from search results
      if (productFromState.image_url) {
        return [productFromState.image_url];
      }
      if (Array.isArray(productFromState.images)) {
        return productFromState.images;
      }
    }
    // Fallback to mock images
    return Array.isArray(product.images) ? product.images : ['/placeholder-image.jpg'];
  };

  const productImages = getProductImages();

  const calculateDiscount = (price, mrp) => {
    if (!mrp || mrp <= price) return 0;
    return Math.round(((mrp - price) / mrp) * 100);
  };

  const handleAddToCart = () => {
    if ((safeSizes.length > 0 && !selectedSize) || (safeColors.length > 0 && !selectedColor)) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    const cartItem = {
      ...product,
      selectedSize: safeSizes.length > 0 ? selectedSize : 'One Size',
      selectedColor: safeColors.length > 0 ? selectedColor : 'Standard',
      quantity,
      // Preserve all data
      features: safeFeatures,
      sizes: safeSizes,
      colors: safeColors,
      images: productImages
    };

    addToCart(cartItem);
    
    // Show success message
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleBuyNow = () => {
    if ((safeSizes.length > 0 && !selectedSize) || (safeColors.length > 0 && !selectedColor)) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    const cartItem = {
      ...product,
      selectedSize: safeSizes.length > 0 ? selectedSize : 'One Size',
      selectedColor: safeColors.length > 0 ? selectedColor : 'Standard',
      quantity,
      // Preserve all data
      features: safeFeatures,
      sizes: safeSizes,
      colors: safeColors,
      images: productImages
    };

    addToCart(cartItem);
    navigate('/checkout');
  };

  const discount = calculateDiscount(product.price, product.mrp);

  return (
    <>
      <Header />
      <Container className="my-5 product-detail-page">
        <Button 
          variant="outline-secondary" 
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <i className="fas fa-arrow-left me-2"></i>
          Back to Products
        </Button>

        {showAlert && (
          <Alert 
            variant={((safeSizes.length > 0 && !selectedSize) || (safeColors.length > 0 && !selectedColor)) ? "warning" : "success"} 
            className="mb-4"
          >
            {(safeSizes.length > 0 && !selectedSize) || (safeColors.length > 0 && !selectedColor)
              ? "Please select size and color before adding to cart" 
              : "Product added to cart successfully!"
            }
          </Alert>
        )}

        <Row className="g-5">
          {/* Product Images */}
          <Col lg={6}>
            <div className="product-images">
              {productImages.length > 1 ? (
                <Carousel interval={null} className="product-carousel">
                  {productImages.map((image, index) => (
                    <Carousel.Item key={index}>
                      <img
                        className="d-block w-100 product-main-image"
                        src={image}
                        alt={`${product.name} view ${index + 1}`}
                        onError={(e) => {
                          e.target.src = '/placeholder-image.jpg';
                        }}
                      />
                    </Carousel.Item>
                  ))}
                </Carousel>
              ) : (
                <img
                  src={productImages[0]}
                  alt={product.name}
                  className="product-main-image w-100"
                  onError={(e) => {
                    e.target.src = '/placeholder-image.jpg';
                  }}
                />
              )}
              
              {/* Thumbnail Images */}
              {productImages.length > 1 && (
                <div className="product-thumbnails mt-3">
                  {productImages.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="thumbnail-image"
                      onClick={() => {/* Add thumbnail click handler */}}
                    />
                  ))}
                </div>
              )}
            </div>
          </Col>

          {/* Product Information */}
          <Col lg={6}>
            <div className="product-info">
              <div className="product-header mb-3">
                <h1 className="product-title">{product.name || 'Product Name'}</h1>
                <div className="product-rating d-flex align-items-center mb-2">
                  <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <i 
                        key={star}
                        className={`fas fa-star ${star <= Math.floor(product.rating || 0) ? 'text-warning' : 'text-light'}`}
                      ></i>
                    ))}
                  </div>
                  <span className="rating-text ms-2">
                    {product.rating || 0} ({product.reviewCount || 0} reviews)
                  </span>
                </div>
                <div className="product-sku text-muted">
                  SKU: {product.sku || 'N/A'}
                </div>
              </div>

              {/* Price Section */}
              <div className="price-section mb-4">
                <div className="d-flex align-items-center flex-wrap">
                  <span className="current-price h2 text-primary me-3">
                    ${product.price || 0}
                  </span>
                  {product.mrp && product.mrp > product.price && (
                    <>
                      <span className="original-price h4 text-muted text-decoration-line-through me-3">
                        ${product.mrp}
                      </span>
                      {discount > 0 && (
                        <Badge bg="danger" className="discount-badge fs-6">
                          Save {discount}%
                        </Badge>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Product Description */}
              <div className="product-description mb-4">
                <p className="text-muted">{product.description || 'No description available.'}</p>
              </div>

              {/* Features */}
              {safeFeatures.length > 0 && (
                <div className="product-features mb-4">
                  <h5>Features:</h5>
                  <ul className="features-list">
                    {safeFeatures.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Size Selection - Only show if sizes exist */}
              {safeSizes.length > 0 && (
                <div className="size-selection mb-4">
                  <h6>Size: <span className="text-danger">*</span></h6>
                  <div className="size-options">
                    {safeSizes.map((size) => (
                      <Button
                        key={size}
                        variant={selectedSize === size ? "primary" : "outline-secondary"}
                        className="size-option me-2 mb-2"
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection - Only show if colors exist */}
              {safeColors.length > 0 && (
                <div className="color-selection mb-4">
                  <h6>Color: <span className="text-danger">*</span></h6>
                  <div className="color-options">
                    {safeColors.map((color) => (
                      <div
                        key={color.name}
                        className={`color-option ${selectedColor === color.name ? 'selected' : ''}`}
                        onClick={() => setSelectedColor(color.name)}
                        title={color.name}
                      >
                        <div 
                          className="color-swatch"
                          style={{ backgroundColor: color.value }}
                        ></div>
                        <span className="color-name">{color.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Show message if no sizes/colors are needed */}
              {safeSizes.length === 0 && safeColors.length === 0 && (
                <Alert variant="info" className="mb-4">
                  This product doesn't require size or color selection.
                </Alert>
              )}

              {/* Quantity Selection */}
              <div className="quantity-selection mb-4">
                <h6>Quantity:</h6>
                <div className="quantity-controls d-flex align-items-center">
                  <Button
                    variant="outline-secondary"
                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <Form.Control
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="quantity-input mx-2 text-center"
                    min="1"
                    style={{ width: '80px' }}
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons mb-4">
                <div className="d-grid gap-2 d-md-flex">
                  <Button
                    variant="primary"
                    size="lg"
                    className="flex-fill me-md-2 mb-2 mb-md-0"
                    onClick={handleAddToCart}
                  >
                    <i className="fas fa-cart-plus me-2"></i>
                    Add to Cart
                  </Button>
                  <Button
                    variant="success"
                    size="lg"
                    className="flex-fill"
                    onClick={handleBuyNow}
                  >
                    <i className="fas fa-bolt me-2"></i>
                    Buy Now
                  </Button>
                </div>
              </div>

              {/* Additional Info */}
              <div className="additional-info">
                <div className="info-item d-flex align-items-center mb-2">
                  <i className="fas fa-truck me-3 text-muted"></i>
                  <span>Free shipping on orders over $50</span>
                </div>
                <div className="info-item d-flex align-items-center mb-2">
                  <i className="fas fa-undo me-3 text-muted"></i>
                  <span>30-day return policy</span>
                </div>
                <div className="info-item d-flex align-items-center">
                  <i className="fas fa-shield-alt me-3 text-muted"></i>
                  <span>2-year warranty</span>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ProductDetail;