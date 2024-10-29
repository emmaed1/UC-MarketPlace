// Cart.js
import { React, useContext } from 'react';
import  CartContext from '../Context/CartContext';

const Cart = () => {
  const { state } = useContext(CartContext);

  return (
    <div>
      <h2>Shopping Cart</h2>
      <ul>
        {state.items.map(item => (
          <li key={item.id}>
            {item.name} - ${item.price} x {item.quantity}
          </li>
        ))}
      </ul>
      <p>Total: ${state.total}</p>
    </div>
  );
};

export default Cart;