import React from 'react'
import { useNavigate, Link } from 'react-router-dom'

function Button({ 
  fun,
  buttonname, 
  bgcolor, 
  color, 
  variant = 'primary', 
  size = 'medium', 
  className = '', 
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  onClick,
  type = 'button', // Add type prop
  ...props 
}) {
  const navigate = useNavigate()

  const getButtonStyles = () => {
    const baseStyles = {
      primary: { 
        bg: '#2563eb', 
        color: '#ffffff',
        hoverBg: '#1d4ed8',
        border: 'none'
      },
      secondary: { 
        bg: '#64748b', 
        color: '#ffffff',
        hoverBg: '#475569',
        border: 'none'
      },
      success: { 
        bg: '#059669', 
        color: '#ffffff',
        hoverBg: '#047857',
        border: 'none'
      },
      danger: { 
        bg: '#dc2626', 
        color: '#ffffff',
        hoverBg: '#b91c1c',
        border: 'none'
      },
      outline: { 
        bg: 'transparent', 
        color: '#374151',
        hoverBg: '#f3f4f6',
        border: '1.5px solid #d1d5db'
      },
      ghost: {
        bg: 'transparent',
        color: '#2563eb',
        hoverBg: '#eff6ff',
        border: 'none'
      },
      link: { // Add link variant
        bg: 'transparent',
        color: '#2563eb',
        hoverBg: 'transparent',
        border: 'none',
        textDecoration: 'underline'
      }
    }

    const variantStyle = baseStyles[variant] || baseStyles.primary
    
    return {
      background: disabled ? '#f3f4f6' : (bgcolor || variantStyle.bg),
      color: disabled ? '#9ca3af' : (color || variantStyle.color),
      border: variantStyle.border || 'none',
      padding: size === 'large' ? '14px 28px' : 
               size === 'small' ? '8px 16px' : 
               '11px 22px',
      fontSize: size === 'large' ? '1rem' : 
                size === 'small' ? '0.875rem' : 
                '0.9375rem',
      fontWeight: '600',
      width: fullWidth ? '100%' : 'auto',
      opacity: disabled ? 0.6 : 1,
      cursor: disabled ? 'not-allowed' : 'pointer',
      borderRadius: variant === 'link' ? '0' : '6px',
      textDecoration: variantStyle.textDecoration || 'none',
      display: 'inline-block',
      textAlign: 'center'
    }
  }

  const getButtonClasses = () => {
    const baseClasses = `custom-button fw-semibold transition-all ${
      disabled ? 'disabled' : ''
    } ${loading ? 'loading' : ''} ${fullWidth ? 'w-100' : ''}`
    
    return `${baseClasses} ${className}`.trim()
  }

  const handleClick = (e) => {
    if (disabled || loading) return

    // Call custom onClick handler if provided
    if (onClick) {
      onClick(e)
    }

    // Navigate if fun is provided and no custom onClick
    if (fun && !onClick) {
      navigate(fun)
    }
  }

  // If it's a simple link with no onClick, use Link component for better accessibility
  if (fun && !onClick && variant === 'link') {
    return (
      <Link
        to={fun}
        className={getButtonClasses()}
        style={getButtonStyles()}
        {...props}
      >
        <span className="button-content d-flex align-items-center justify-content-center gap-2">
          {icon && <i className={`bi bi-${icon}`}></i>}
          {buttonname}
        </span>
      </Link>
    )
  }

  // For all other cases, use button element
  return (
    <button
      type={type}
      className={getButtonClasses()}
      style={getButtonStyles()}
      disabled={disabled}
      onClick={handleClick}
      {...props}
    >
      <span className="button-content d-flex align-items-center justify-content-center gap-2">
        {loading && (
          <div className="spinner-border spinner-border-sm" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        )}
        {icon && !loading && <i className={`bi bi-${icon}`}></i>}
        {buttonname}
      </span>
    </button>
  )
}

export default Button
