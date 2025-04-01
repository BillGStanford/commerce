import { createContext } from 'react';

const CartContext = createContext({
  cart: [],
  cartTotal: 0,
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {}
});

export default CartContext;