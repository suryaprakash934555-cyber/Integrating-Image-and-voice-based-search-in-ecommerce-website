import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.length > 50) {
      newErrors.firstName = 'First name must be less than 50 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase letters and numbers';
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and user data if auto-login is enabled
        if (data.token && data.user) {
          register(data.user, data.token);
          setErrors({ general: { message: 'Registration successful! Redirecting...', type: 'success' } });
          
          setTimeout(() => {
            navigate('/dashboard');
          }, 1500);
        } else {
          // If email verification is required
          setErrors({ 
            general: { 
              message: 'Registration successful! Please check your email for verification.', 
              type: 'success' 
            } 
          });
          
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        }
      } else {
        setErrors({ general: { message: data.error || 'Registration failed', type: 'danger' } });
      }
    } catch (error) {
      setErrors({ general: { message: 'Network error. Please try again.', type: 'danger' } });
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoFill = () => {
    setFormData({
      firstName: 'John',
      lastName: 'Doe',
      email: 'demo@example.com',
      password: 'Demo123!',
      confirmPassword: 'Demo123!'
    });
  };

  const passwordStrength = () => {
    if (!formData.password) return { strength: 0, label: '', variant: '' };
    
    let strength = 0;
    if (formData.password.length >= 8) strength += 25;
    if (/[a-z]/.test(formData.password)) strength += 25;
    if (/[A-Z]/.test(formData.password)) strength += 25;
    if (/\d/.test(formData.password)) strength += 25;

    let label = '';
    let variant = '';
    
    if (strength <= 25) {
      label = 'Weak';
      variant = 'danger';
    } else if (strength <= 50) {
      label = 'Fair';
      variant = 'warning';
    } else if (strength <= 75) {
      label = 'Good';
      variant = 'info';
    } else {
      label = 'Strong';
      variant = 'success';
    }

    return { strength, label, variant };
  };

  const strengthInfo = passwordStrength();

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6} xl={5}>
          <Card className="shadow">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <h2 className="card-title fw-bold text-primary">Create Account</h2>
                <p className="text-muted">Join our e-commerce platform today</p>
              </div>

              {errors.general && (
                <Alert variant={errors.general.type} className="mb-3">
                  {errors.general.message}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>First Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        isInvalid={!!errors.firstName}
                        placeholder="Enter your first name"
                        disabled={isLoading}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.firstName}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        isInvalid={!!errors.lastName}
                        placeholder="Enter your last name"
                        disabled={isLoading}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.lastName}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Email Address *</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    isInvalid={!!errors.email}
                    placeholder="Enter your email"
                    disabled={isLoading}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password *</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      isInvalid={!!errors.password}
                      placeholder="Create a strong password"
                      disabled={isLoading}
                    />
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className="position-absolute top-50 end-0 translate-middle-y border-0"
                      onClick={() => setShowPassword(!showPassword)}
                      type="button"
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </Button>
                  </div>
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                  
                  {/* Password Strength Meter */}
                  {formData.password && (
                    <div className="mt-2">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <small>Password Strength:</small>
                        <small className={`text-${strengthInfo.variant} fw-bold`}>
                          {strengthInfo.label}
                        </small>
                      </div>
                      <div className="progress" style={{ height: '5px' }}>
                        <div
                          className={`progress-bar bg-${strengthInfo.variant}`}
                          role="progressbar"
                          style={{ width: `${strengthInfo.strength}%` }}
                          aria-valuenow={strengthInfo.strength}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  <Form.Text className="text-muted">
                    Password must be at least 8 characters with uppercase, lowercase, and numbers.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Confirm Password *</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      isInvalid={!!errors.confirmPassword}
                      placeholder="Confirm your password"
                      disabled={isLoading}
                    />
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className="position-absolute top-50 end-0 translate-middle-y border-0"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      type="button"
                    >
                      {showConfirmPassword ? '🙈' : '👁️'}
                    </Button>
                  </div>
                  <Form.Control.Feedback type="invalid">
                    {errors.confirmPassword}
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="d-grid mb-3">
                  <Button
                    variant="primary"
                    type="submit"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Creating Account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </div>

                <div className="text-center mb-3">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={handleDemoFill}
                    disabled={isLoading}
                  >
                    Fill Demo Data
                  </Button>
                </div>
              </Form>

              <div className="text-center">
                <p className="mb-0">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary text-decoration-none fw-semibold">
                    Sign in here
                  </Link>
                </p>
              </div>

              <hr className="my-4" />

              <div className="text-center">
                <small className="text-muted">
                  By creating an account, you agree to our{' '}
                  <a href="/terms" className="text-decoration-none">Terms of Service</a>{' '}
                  and{' '}
                  <a href="/privacy" className="text-decoration-none">Privacy Policy</a>
                </small>
              </div>
            </Card.Body>
          </Card>

          {/* Security Features Info */}
          <Card className="mt-4 border-0 bg-light">
            <Card.Body className="p-3">
              <div className="text-center">
                <small className="text-muted">
                  <i className="bi bi-shield-check me-1"></i>
                  Your data is protected with bank-level security including:
                </small>
                <div className="mt-2">
                  <small className="text-muted me-3">
                    <i className="bi bi-lock me-1"></i>End-to-end encryption
                  </small>
                  <small className="text-muted me-3">
                    <i className="bi bi-key me-1"></i>Secure password hashing
                  </small>
                  <small className="text-muted">
                    <i className="bi bi-envelope-check me-1"></i>Email verification
                  </small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;