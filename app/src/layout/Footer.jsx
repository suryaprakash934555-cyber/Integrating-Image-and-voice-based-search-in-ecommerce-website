import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer bg-dark text-light py-5">
      <Container>
        <Row>
          <Col lg={3} md={6} className="mb-4 mb-md-0">
            <div className="footer-brand">
              <h5 className="footer-heading">Fashion Store</h5>
              <p className="footer-text">
                Your premier destination for trendy and affordable fashion. We offer quality clothing for everyone.
              </p>
              <div className="payment-methods mt-3">
                <h6>We Accept:</h6>
                <div className="d-flex flex-wrap gap-2 mt-2">
                  <span className="payment-icon">💳</span>
                  <span className="payment-icon">📱</span>
                  <span className="payment-icon">🏦</span>
                  <span className="payment-icon">🔒</span>
                </div>
              </div>
            </div>
          </Col>
          <Col lg={3} md={6} className="mb-4 mb-md-0">
            <h5 className="footer-heading">Shop</h5>
            <ul className="footer-links list-unstyled">
              <li><Link to="/men" className="footer-link">Men's Collection</Link></li>
              <li><Link to="/women" className="footer-link">Women's Collection</Link></li>
              <li><Link to="/kids" className="footer-link">Kids' Collection</Link></li>
              <li><Link to="/accessories" className="footer-link">Accessories</Link></li>
              <li><Link to="/new-arrivals" className="footer-link">New Arrivals</Link></li>
              <li><Link to="/sale" className="footer-link">Sale</Link></li>
            </ul>
          </Col>
          <Col lg={3} md={6} className="mb-4 mb-md-0">
            <h5 className="footer-heading">Customer Service</h5>
            <ul className="footer-links list-unstyled">
              <li><Link to="/contact" className="footer-link">Contact Us</Link></li>
              <li><Link to="/faq" className="footer-link">FAQ</Link></li>
              <li><Link to="/shipping" className="footer-link">Shipping & Returns</Link></li>
              <li><Link to="/size-guide" className="footer-link">Size Guide</Link></li>
              <li><Link to="/privacy" className="footer-link">Privacy Policy</Link></li>
              <li><Link to="/terms" className="footer-link">Terms & Conditions</Link></li>
            </ul>
          </Col>
          <Col lg={3} md={6}>
            <h5 className="footer-heading">Stay Connected</h5>
            <div className="footer-contact">
              <div className="newsletter mb-3">
                <h6>Subscribe to our newsletter</h6>
                <div className="input-group mt-2">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Your email"
                    aria-label="Your email"
                  />
                  <button className="btn btn-primary" type="button">
                    Subscribe
                  </button>
                </div>
              </div>
              <div className="social-links mt-4">
                <h6>Follow Us:</h6>
                <div className="d-flex gap-3 mt-2">
                  <Link to="#" className="social-link">📱</Link>
                  <Link to="#" className="social-link">📷</Link>
                  <Link to="#" className="social-link">👔</Link>
                  <Link to="#" className="social-link">🐦</Link>
                </div>
              </div>
            </div>
          </Col>
        </Row>
        <hr className="footer-divider my-4" />
        <Row>
          <Col md={6} className="text-center text-md-start">
            <div className="footer-bottom">
              <small>&copy; {new Date().getFullYear()} Fashion Store. All rights reserved.</small>
            </div>
          </Col>
          <Col md={6} className="text-center text-md-end">
            <div className="footer-credits">
              <small>Secure payments • Free shipping on orders over $50 • Easy returns</small>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;