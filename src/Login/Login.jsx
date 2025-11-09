import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        setErrors({ general: 'Login successful!' });
        
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        setErrors({ general: data.error || 'Invalid credentials' });
      }
    } catch (error) {
      setErrors({ general: 'Network error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (role) => {
    const demoCredentials = {
      user: { email: 'demo@example.com', password: 'demo123' },
      admin: { email: 'admin@example.com', password: 'admin123' }
    };
    setFormData(demoCredentials[role]);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-brand">
          <div className="brand-logo">
            <i className="bi bi-shop"></i>
          </div>
          <h2>Elegance</h2>
        </div>

        <div className="login-header">
          <h3>Welcome Back</h3>
          <p>Sign in to continue</p>
        </div>

        {errors.general && (
          <div className={`alert ${errors.general.includes('successful') ? 'alert-success' : 'alert-error'}`}>
            <i className={`bi ${errors.general.includes('successful') ? 'bi-check-circle' : 'bi-exclamation-circle'}`}></i>
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-container">
              <i className="bi bi-envelope input-icon"></i>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
                placeholder="your@email.com"
                disabled={isLoading}
              />
            </div>
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-container">
              <i className="bi bi-lock input-icon"></i>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'error' : ''}
                placeholder="••••••••"
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
              </button>
            </div>
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <div className="form-options">
            <label className="checkbox-container">
              <input type="checkbox" />
              <span className="checkmark"></span>
              Remember me
            </label>
            <Link to="/forgot-password" className="forgot-password">
              Forgot password?
            </Link>
          </div>

          <button 
            type="submit" 
            className={`login-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="button-spinner"></div>
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="demo-section">
          <div className="divider">
            <span>Quick Demo</span>
          </div>
          <div className="demo-buttons">
            <button 
              type="button" 
              className="demo-button"
              onClick={() => handleDemoLogin('user')}
              disabled={isLoading}
            >
              <i className="bi bi-person"></i>
              User
            </button>
            <button 
              type="button" 
              className="demo-button"
              onClick={() => handleDemoLogin('admin')}
              disabled={isLoading}
            >
              <i className="bi bi-shield-check"></i>
              Admin
            </button>
          </div>
        </div>

        <div className="login-footer">
          <p>New user? <Link to="/register" className="signup-link">Sign up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
