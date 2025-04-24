import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';

// Initial state for the cart
const initialState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

// Create the context
const CartContext = createContext();

// Cart reducer function
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const { product, stockLimit } = action.payload;
      const existingItemIndex = state.items.findIndex(
        (item) => item._id === product._id
      );

      let updatedItems;
      if (existingItemIndex > -1) {
        // Item exists, update quantity (respecting stock limit)
        updatedItems = state.items.map((item, index) => {
          if (index === existingItemIndex) {
            // Check if adding one more would exceed stock
            const newQuantity = item.quantity + 1;
            if (newQuantity > stockLimit) {
              // Don't update if exceeding stock limit
              return item;
            }
            return {
              ...item,
              quantity: newQuantity,
              totalPrice: newQuantity * item.price,
            };
          }
          return item;
        });
      } else {
        // Add new item to cart
        const newItem = {
          ...product,
          quantity: 1,
          totalPrice: product.price,
        };
        updatedItems = [...state.items, newItem];
      }

      // Calculate new totals
      const newTotalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const newTotalPrice = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);

      return {
        ...state,
        items: updatedItems,
        totalItems: newTotalItems,
        totalPrice: newTotalPrice,
      };
    }

    case 'REMOVE_FROM_CART': {
      const existingItemIndex = state.items.findIndex(
        (item) => item._id === action.payload._id
      );

      if (existingItemIndex === -1) {
        return state;
      }

      let updatedItems;
      const existingItem = state.items[existingItemIndex];

      if (existingItem.quantity === 1) {
        // Remove item completely
        updatedItems = state.items.filter(item => item._id !== action.payload._id);
      } else {
        // Decrease quantity
        updatedItems = state.items.map((item, index) => {
          if (index === existingItemIndex) {
            return {
              ...item,
              quantity: item.quantity - 1,
              totalPrice: (item.quantity - 1) * item.price,
            };
          }
          return item;
        });
      }

      // Calculate new totals
      const newTotalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const newTotalPrice = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);

      return {
        ...state,
        items: updatedItems,
        totalItems: newTotalItems,
        totalPrice: newTotalPrice,
      };
    }

    case 'UPDATE_QUANTITY': {
      const { _id, quantity, stockLimit } = action.payload;
      
      if (quantity <= 0) {
        const updatedItems = state.items.filter(item => item._id !== _id);
        const newTotalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
        const newTotalPrice = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
        
        return {
          ...state,
          items: updatedItems,
          totalItems: newTotalItems,
          totalPrice: newTotalPrice,
        };
      }
      
      // Don't allow updating beyond stock limit
      const updatedItems = state.items.map(item => {
        if (item._id === _id) {
          // Check if the new quantity exceeds stock limit
          const newQuantity = stockLimit !== undefined ? 
            Math.min(quantity, stockLimit) : quantity;
            
          return {
            ...item,
            quantity: newQuantity,
            totalPrice: newQuantity * item.price,
          };
        }
        return item;
      });
      
      const newTotalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const newTotalPrice = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
      
      return {
        ...state,
        items: updatedItems,
        totalItems: newTotalItems,
        totalPrice: newTotalPrice,
      };
    }

    case 'CLEAR_CART':
      return {
        ...initialState
      };

    default:
      return state;
  }
};

// Cart provider component
export const CartProvider = ({ children }) => {
  const [stockExceededMessage, setStockExceededMessage] = useState('');
  
  // Try to load cart from localStorage
  const loadCartFromStorage = () => {
    try {
      const storedCart = localStorage.getItem('cart');
      return storedCart ? JSON.parse(storedCart) : initialState;
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
      return initialState;
    }
  };

  const [cart, dispatch] = useReducer(cartReducer, loadCartFromStorage());

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Cart actions
  const addToCart = (product) => {
    // Find if the product is already in the cart
    const existingItem = cart.items.find(item => item._id === product._id);
    const currentQuantity = existingItem ? existingItem.quantity : 0;
    
    // Check if adding one more would exceed the stock
    if (currentQuantity >= product.stock) {
      setStockExceededMessage(`Cannot add more ${product.name}. Stock limit reached (${product.stock} available).`);
      setTimeout(() => setStockExceededMessage(''), 3000);
      return false;
    }

    dispatch({ 
      type: 'ADD_TO_CART', 
      payload: { 
        product, 
        stockLimit: product.stock 
      }
    });
    return true;
  };

  const removeFromCart = (product) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: product });
  };

  const updateQuantity = (productId, quantity) => {
    // Find the current product in cart to get its stock limit
    const product = cart.items.find(item => item._id === productId);
    if (!product) return;
    
    // Check if requested quantity exceeds stock
    if (quantity > product.stock) {
      setStockExceededMessage(`Cannot add ${quantity} units of ${product.name}. Only ${product.stock} available.`);
      setTimeout(() => setStockExceededMessage(''), 3000);
      quantity = product.stock; // Limit to max stock
    }
    
    dispatch({ 
      type: 'UPDATE_QUANTITY', 
      payload: { 
        _id: productId, 
        quantity,
        stockLimit: product.stock
      }
    });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        stockExceededMessage,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};