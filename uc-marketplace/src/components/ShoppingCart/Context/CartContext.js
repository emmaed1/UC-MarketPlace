import React, { createContext, useReducer, useEffect } from 'react';
import cartReducer from './CartReducer';

/* Cart Context */
const cartContext = createContext();

/* Get initial state from localStorage or use default */
const getInitialState = () => {
  const savedCart = localStorage.getItem('cart');
  return savedCart ? JSON.parse(savedCart) : {
    isCartOpen: false,
    cartItems: []
  };
};

/* Cart-Provider Component */
const CartProvider = ({ children }) => {

    const [state, dispatch] = useReducer(cartReducer, getInitialState());

    /* Save cart state to localStorage whenever it changes */
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(state));
    }, [state]);

    /* Dispatched Actions */

    const toggleCart = (toggle) => {
      console.log("Clicked Shopping Cart")
        return dispatch({
            type: 'TOGGLE_CART',
            payload: {
                toggle
            }
        });
    };

    const addItem = (item) => {
        return dispatch({
            type: 'ADD_TO_CART',
            payload: {
                item
            }
        });
    };

    const removeItem = (itemId) => {
        return dispatch({
            type: 'REMOVE_FROM_CART',
            payload: {
                itemId
            }
        });
    };

    const incrementItem = (itemId) => {
        return dispatch({
            type: 'INCREMENT',
            payload: {
                itemId
            }
        });
    };

    const decrementItem = (itemId) => {
        return dispatch({
            type: 'DECREMENT',
            payload: {
                itemId
            }
        });
    };

    const clearCart = () => {
        return dispatch({
            type: 'CLEAR_CART'
        });
    };

    // Context values
    const values = {
        ...state,
        toggleCart,
        addItem,
        removeItem,
        incrementItem,
        decrementItem,
        clearCart
    };

    return (
        <cartContext.Provider value={values}>
            {children}
        </cartContext.Provider>
    );

};

export default cartContext;
export { CartProvider };