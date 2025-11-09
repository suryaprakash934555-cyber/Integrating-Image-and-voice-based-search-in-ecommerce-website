import React, { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    // In CartContext.js, update the ADD_TO_CART case:
case 'ADD_TO_CART':
  const existingItem = state.items.find(item => 
    item.id === action.payload.id && 
    item.selectedSize === action.payload.selectedSize &&
    item.selectedColor === action.payload.selectedColor
  );
  
  if (existingItem) {
    return {
      ...state,
      items: state.items.map(item =>
        item.id === action.payload.id &&
        item.selectedSize === action.payload.selectedSize &&
        item.selectedColor === action.payload.selectedColor
          ? { ...item, quantity: item.quantity + (action.payload.quantity || 1) }
          : item
      )
    };
  }
  return {
    ...state,
    items: [...state.items, { 
      ...action.payload, 
      quantity: action.payload.quantity || 1 
    }]
  };
  
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };

    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      };

    case 'TOGGLE_CART':
      return {
        ...state,
        isCartOpen: !state.isCartOpen
      };

    default:
      return state;
  }
};

const initialState = {
  items: [],
  isCartOpen: false
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  const getCartTotal = () => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      items: state.items,
      isCartOpen: state.isCartOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      toggleCart,
      getCartTotal,
      getCartItemsCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};