import React, { createContext, useContext, useReducer, useEffect } from 'react';

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
      const existingItemIndex = state.items.findIndex(
        (item) => item._id === action.payload._id
      );

      let updatedItems;
      if (existingItemIndex > -1) {
        // Item exists, update quantity
        updatedItems = state.items.map((item, index) => {
          if (index === existingItemIndex) {
            return {
              ...item,
              quantity: item.quantity + 1,
              totalPrice: (item.quantity + 1) * item.price,
            };
          }
          return item;
        });
      } else {
        // Add new item to cart
        const newItem = {
          ...action.payload,
          quantity: 1,
          totalPrice: action.payload.price,
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
      const { _id, quantity } = action.payload;
      
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
      
      const updatedItems = state.items.map(item => {
        if (item._id === _id) {
          return {
            ...item,
            quantity,
            totalPrice: quantity * item.price,
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
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const removeFromCart = (product) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: product });
  };

  const updateQuantity = (productId, quantity) => {
    dispatch({ 
      type: 'UPDATE_QUANTITY', 
      payload: { _id: productId, quantity }
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