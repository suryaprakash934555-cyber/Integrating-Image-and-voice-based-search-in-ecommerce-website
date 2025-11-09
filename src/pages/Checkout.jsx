import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, ListGroup, Badge } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Header from '../layout/Header';
import './style.css';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  
  const { cartItems = [], cartTotal = 0 } = location.state || {};
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Australia',
    paymentMethod: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    saveInfo: false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      return 'Please fill in all required fields';
    }
    if (!formData.address || !formData.city || !formData.zipCode) {
      return 'Please complete your shipping address';
    }
    if (formData.paymentMethod === 'card') {
      if (!formData.cardNumber || !formData.expiryDate || !formData.cvv || !formData.nameOnCard) {
        return 'Please complete your payment information';
      }
      if (formData.cardNumber.replace(/\s/g, '').length !== 16) {
        return 'Please enter a valid 16-digit card number';
      }
    }
    return null;
  };

  const processPayment = async () => {
    // Calculate final total with tax
    const tax = cartTotal * 0.1;
    const finalTotal = cartTotal + tax;

    try {
      setLoading(true);
      setError('');

      // Create payment intent with Stripe
      const paymentResponse = await fetch('http://localhost:5000/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(finalTotal * 100), // Convert to cents
          currency: 'aud',
          items: cartItems,
          customer_email: formData.email
        }),
      });

      const paymentData = await paymentResponse.json();

      if (!paymentResponse.ok) {
        throw new Error(paymentData.error || 'Payment processing failed');
      }

      return paymentData;
    } catch (error) {
      throw new Error(`Payment error: ${error.message}`);
    }
  };

  const placeOrder = async (paymentIntentId = null) => {
    const tax = cartTotal * 0.1;
    const finalTotal = cartTotal + tax;

    try {
      const orderData = new FormData();
      orderData.append('name', `${formData.firstName} ${formData.lastName}`);
      orderData.append('mobile', formData.phone);
      orderData.append('address', `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`);
      orderData.append('email', formData.email);
      orderData.append('payment_method', formData.paymentMethod);
      
      const itemsData = cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image_url: item.image_url,
        size: item.selectedSize,
        color: item.selectedColor
      }));
      
      orderData.append('items', JSON.stringify(itemsData));
      orderData.append('price', finalTotal.toFixed(2));

      const response = await fetch('http://localhost:5000/place-order-with-payment', {
        method: 'POST',
        body: orderData,
      });

      const orderResult = await response.json();

      if (!response.ok) {
        throw new Error(orderResult.error || 'Order placement failed');
      }

      return orderResult;
    } catch (error) {
      throw new Error(`Order placement error: ${error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError('');

      let paymentResult = null;
      
      if (formData.paymentMethod === 'card') {
        paymentResult = await processPayment();
      }

      const orderResult = await placeOrder(paymentResult?.paymentIntentId);

      // Clear cart on successful order
      clearCart();
      
      setOrderSuccess(true);
      setOrderDetails({
        orderId: orderResult.order_id,
        trackingNumber: orderResult.tracking_number,
        total: cartTotal,
        paymentIntent: paymentResult
      });

      if (formData.paymentMethod === 'card' && paymentResult?.clientSecret) {
        // Redirect to payment page or handle Stripe payment
        navigate('/payment', { 
          state: { 
            clientSecret: paymentResult.clientSecret,
            orderId: orderResult.order_id,
            amount: cartTotal
          }
        });
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess && !orderDetails?.paymentIntent) {
    return (
      <>
        <Header />
        <Container className="my-5">
          <div className="text-center">
            <div className="success-animation">
              <i className="fas fa-check-circle text-success" style={{ fontSize: '4rem' }}></i>
            </div>
            <h2 className="mt-4">Order Placed Successfully!</h2>
            <p className="lead">Thank you for your purchase</p>
            
            <Card className="mt-4">
              <Card.Body>
                <h5>Order Details</h5>
                <p><strong>Order ID:</strong> {orderDetails?.orderId}</p>
                <p><strong>Tracking Number:</strong> {orderDetails?.trackingNumber}</p>
                <p><strong>Total Amount:</strong> ${orderDetails?.total?.toFixed(2)}</p>
                <p><strong>Payment Method:</strong> {formData.paymentMethod === 'card' ? 'Credit Card' : 'Cash on Delivery'}</p>
              </Card.Body>
            </Card>

            <div className="mt-4">
              <Button 
                variant="primary" 
                onClick={() => navigate('/')}
                className="me-3"
              >
                Continue Shopping
              </Button>
              <Button 
                variant="outline-secondary"
                onClick={() => navigate('/orders')}
              >
                View Orders
              </Button>
            </div>
          </div>
        </Container>
      </>
    );
  }

  return (
    <>
      <Header />
      <Container className="my-5 checkout-page">
        <Row>
          <Col lg={8}>
            <Card className="mb-4">
              <Card.Header>
                <h4 className="mb-0">Checkout</h4>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  {/* Personal Information */}
                  <h5 className="mb-3">Personal Information</h5>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>First Name *</Form.Label>
                        <Form.Control
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Last Name *</Form.Label>
                        <Form.Control
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email *</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Phone *</Form.Label>
                        <Form.Control
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Shipping Address */}
                  <h5 className="mb-3 mt-4">Shipping Address</h5>
                  <Form.Group className="mb-3">
                    <Form.Label>Address *</Form.Label>
                    <Form.Control
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>City *</Form.Label>
                        <Form.Control
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>State</Form.Label>
                        <Form.Control
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>ZIP Code *</Form.Label>
                        <Form.Control
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Payment Method */}
                  <h5 className="mb-3 mt-4">Payment Method</h5>
                  <Form.Group className="mb-3">
                    <Form.Check
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleInputChange}
                      label="Credit/Debit Card"
                      id="payment-card"
                    />
                    <Form.Check
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleInputChange}
                      label="Cash on Delivery"
                      id="payment-cod"
                    />
                  </Form.Group>

                  {formData.paymentMethod === 'card' && (
                    <>
                      <Form.Group className="mb-3">
                        <Form.Label>Card Number *</Form.Label>
                        <Form.Control
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          placeholder="1234 5678 9012 3456"
                          maxLength="19"
                        />
                      </Form.Group>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Expiry Date *</Form.Label>
                            <Form.Control
                              type="text"
                              name="expiryDate"
                              value={formData.expiryDate}
                              onChange={handleInputChange}
                              placeholder="MM/YY"
                              maxLength="5"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>CVV *</Form.Label>
                            <Form.Control
                              type="text"
                              name="cvv"
                              value={formData.cvv}
                              onChange={handleInputChange}
                              placeholder="123"
                              maxLength="3"
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="mb-3">
                        <Form.Label>Name on Card *</Form.Label>
                        <Form.Control
                          type="text"
                          name="nameOnCard"
                          value={formData.nameOnCard}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </>
                  )}

                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      name="saveInfo"
                      checked={formData.saveInfo}
                      onChange={handleInputChange}
                      label="Save this information for next time"
                    />
                  </Form.Group>

                  {error && (
                    <Alert variant="danger" className="mt-3">
                      {error}
                    </Alert>
                  )}

                  <div className="d-grid">
                    <Button
                      variant="primary"
                      type="submit"
                      size="lg"
                      disabled={loading || cartItems.length === 0}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Processing...
                        </>
                      ) : (
                        `Place Order - $${(cartTotal * 1.1).toFixed(2)}`
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            {/* Order Summary */}
            <Card className="sticky-top" style={{ top: '20px' }}>
              <Card.Header>
                <h5 className="mb-0">Order Summary</h5>
              </Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  {cartItems.map((item) => (
                    <ListGroup.Item key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="px-0">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <h6 className="mb-1">{item.name}</h6>
                          <small className="text-muted">
                            Qty: {item.quantity}
                            {item.selectedSize && ` • Size: ${item.selectedSize}`}
                            {item.selectedColor && ` • Color: ${item.selectedColor}`}
                          </small>
                        </div>
                        <div className="text-end">
                          <div>${(item.price * item.quantity).toFixed(2)}</div>
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>

                <div className="mt-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal:</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Shipping:</span>
                    <span className="text-success">Free</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Tax (10%):</span>
                    <span>${(cartTotal * 0.1).toFixed(2)}</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between">
                    <strong>Total:</strong>
                    <strong className="text-primary">
                      ${(cartTotal * 1.1).toFixed(2)}
                    </strong>
                  </div>
                </div>

                <div className="security-notice mt-3 text-center">
                  <small className="text-muted">
                    <i className="fas fa-lock me-1"></i>
                    Secure SSL Encryption
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Checkout;