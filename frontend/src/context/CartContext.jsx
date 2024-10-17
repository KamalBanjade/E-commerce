import { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext'; // Import AuthContext to access currentUser

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { currentUser } = useAuth(); // Get the current user from AuthContext
  const [cart, setCart] = useState(() => {
    // Load user-specific cart from localStorage
    const savedCart = currentUser ? localStorage.getItem(`cart_${currentUser.email}`) : null;
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    if (currentUser) {
      // Save cart to user-specific localStorage key whenever the cart changes
      localStorage.setItem(`cart_${currentUser.email}`, JSON.stringify(cart));
    }
  }, [cart, currentUser]);

  // Add item to cart
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      // If item exists, increase its quantity
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      // If item does not exist, add with quantity 1
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // Update item quantity in the cart
  const updateCartQuantity = (id, newQuantity) => {
    setCart(cart.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  // Remove item completely from the cart
  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  // Clear cart (used during logout)
  const clearCart = () => {
    setCart([]);
    if (currentUser) {
      localStorage.removeItem(`cart_${currentUser.email}`); // Clear user-specific cart from localStorage
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateCartQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart
export const useCart = () => useContext(CartContext);
