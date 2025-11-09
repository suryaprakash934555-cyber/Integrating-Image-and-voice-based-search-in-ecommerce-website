import React from 'react';
import { Offcanvas, Button, ListGroup, Badge, Row, Col, Form, Alert } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './style.css';

const CartSidebar = () => {
  const { 
    items, 
    isCartOpen, 
    toggleCart, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getCartTotal,
    getCartItemsCount 
  } = useCart();

  const navigate = useNavigate();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity >= 0) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    // Navigate to checkout page with cart items
    navigate('/checkout', { 
      state: { 
        cartItems: items,
        cartTotal: getCartTotal()
      }
    });
    toggleCart(); // Close the cart sidebar
  };

  const handleQuickCheckout = async () => {
    // Quick checkout without leaving the page
    try {
      const orderData = {
        items: items,
        total: getCartTotal(),
        customerInfo: {} // Will be filled in checkout page
      };

      // You can also directly process payment here if you want
      // For now, just navigate to checkout
      handleCheckout();
      
    } catch (error) {
      console.error('Checkout error:', error);
    }
  };

  return (
    <Offcanvas show={isCartOpen} onHide={toggleCart} placement="end" className="cart-sidebar">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>
          <i className="fas fa-shopping-cart me-2"></i>
          Shopping Cart
          {getCartItemsCount() > 0 && (
            <Badge bg="primary" className="ms-2">
              {getCartItemsCount()}
            </Badge>
          )}
        </Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body>
        {items.length === 0 ? (
          <div className="text-center empty-cart">
            <i className="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
            <p>Your cart is empty</p>
            <Button variant="outline-primary" onClick={toggleCart}>
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              <ListGroup variant="flush">
                {items.map((item) => (
                  <ListGroup.Item key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="cart-item">
                    <Row className="align-items-center">
                      <Col xs={3}>
                        <img 
                          src={item.image_url} 
                          alt={item.name}
                          className="cart-item-image"
                          onError={(e) => {
                            e.target.src = '/placeholder-image.jpg';
                          }}
                        />
                      </Col>
                      <Col xs={9}>
                        <div className="cart-item-details">
                          <h6 className="cart-item-title">{item.name}</h6>
                          <p className="cart-item-price text-primary mb-1">
                            ${item.price}
                          </p>
                          {item.selectedSize && (
                            <small className="text-muted">Size: {item.selectedSize}</small>
                          )}
                          {item.selectedColor && (
                            <small className="text-muted ms-2">Color: {item.selectedColor}</small>
                          )}
                          <div className="cart-item-controls">
                            <div className="quantity-controls">
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                -
                              </Button>
                              <Form.Control
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                                className="quantity-input"
                                min="1"
                              />
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              >
                                +
                              </Button>
                            </div>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => removeFromCart(item.id)}
                              title="Remove item"
                            >
                              <i className="fas fa-trash"></i>
                            </Button>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>

            <div className="cart-summary mt-auto">
              <div className="order-summary mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <span>${getCartTotal().toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping:</span>
                  <span className="text-success">Free</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Tax:</span>
                  <span>${(getCartTotal() * 0.1).toFixed(2)}</span>
                </div>
                <hr />
                <div className="cart-total d-flex justify-content-between mb-3">
                  <strong>Total:</strong>
                  <strong className="text-primary">
                    ${(getCartTotal() * 1.1).toFixed(2)}
                  </strong>
                </div>
              </div>
              
              <div className="cart-actions">
                <div className="d-grid gap-2">
                  <Button 
                    variant="primary" 
                    className="w-100"
                    onClick={handleCheckout}
                    size="lg"
                  >
                    <i className="fas fa-credit-card me-2"></i>
                    Proceed to Checkout
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={clearCart}
                  >
                    <i className="fas fa-trash me-2"></i>
                    Clear Cart
                  </Button>
                </div>
              </div>

              <div className="security-notice mt-3">
                <small className="text-muted">
                  <i className="fas fa-lock me-1"></i>
                  Secure checkout guaranteed
                </small>
              </div>
            </div>
          </>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default CartSidebar;