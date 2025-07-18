import React, { createContext, useContext, useReducer, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const CartContext = createContext();

const initialState = {
  items: [],
  total: 0,
  loading: false,
  pharmacy: null,
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_CART':
      return {
        ...state,
        items: action.payload.items || [],
        total: action.payload.total || 0,
        pharmacy: action.payload.pharmacy || null,
        loading: false,
      };
    case 'ADD_ITEM':
      return {
        ...state,
        items: action.payload.items,
        total: action.payload.total,
      };
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: action.payload.items,
        total: action.payload.total,
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: action.payload.items,
        total: action.payload.total,
      };
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        total: 0,
        pharmacy: null,
      };
    case 'SET_PHARMACY':
      return {
        ...state,
        pharmacy: action.payload,
      };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await api.get('/cart');
      dispatch({ type: 'SET_CART', payload: response.data });
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const addToCart = async (productId, quantity = 1, pharmacyId = null) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await api.post('/cart/add', {
        productId,
        quantity,
        pharmacyId,
      });
      
      dispatch({ type: 'ADD_ITEM', payload: response.data });
      toast.success('Item added to cart!');
      return { success: true };
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      const message = error.response?.data?.message || 'Failed to add item to cart';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const updateCartItem = async (productId, quantity) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await api.put(`/cart/${productId}`, { quantity });
      dispatch({ type: 'UPDATE_ITEM', payload: response.data });
      return { success: true };
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      return { success: false, error: error.response?.data?.message };
    }
  };

  const removeFromCart = async (productId) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await api.delete(`/cart/${productId}`);
      dispatch({ type: 'REMOVE_ITEM', payload: response.data });
      toast.success('Item removed from cart');
      return { success: true };
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      return { success: false, error: error.response?.data?.message };
    }
  };

  const clearCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await api.delete('/cart');
      dispatch({ type: 'CLEAR_CART' });
      toast.success('Cart cleared');
      return { success: true };
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      return { success: false, error: error.response?.data?.message };
    }
  };

  const setPharmacyInCart = async (pharmacyId) => {
    try {
      const response = await api.post('/cart/set-pharmacy', { pharmacyId });
      dispatch({ type: 'SET_PHARMACY', payload: response.data.cart.pharmacy });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  };

  const checkout = async (orderData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await api.post('/cart/checkout', orderData);
      dispatch({ type: 'CLEAR_CART' });
      toast.success('Order placed successfully!');
      return { success: true, order: response.data.order };
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      const message = error.response?.data?.message || 'Checkout failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const getCartItemsCount = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    ...state,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    setPharmacyInCart,
    checkout,
    getCartItemsCount,
    fetchCart,
  };

  return (
    <CartContext.Provider value={value}>
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