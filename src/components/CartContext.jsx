import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  // Load cart from localStorage when the app starts
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("hypermarket-cart");

      return savedCart ? JSON.parse(savedCart) : {};
    } catch (error) {
      console.error("ERROR LOADING CART:", error);
      return {};
    }
  });

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    try {
      localStorage.setItem("hypermarket-cart", JSON.stringify(cart));
    } catch (error) {
      console.error("ERROR SAVING CART:", error);
    }
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existingProduct = prev[product.id];

      const updatedProduct = {
        ...product,
        image: product.image || product.imageUrl || "",
        quantity: (existingProduct?.quantity || 0) + 1,
      };

      console.log("PRODUCT SAVED IN CART:", updatedProduct);
      console.log("IMAGE SAVED IN CART:", updatedProduct.image);

      return {
        ...prev,
        [product.id]: updatedProduct,
      };
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => {
      const updatedCart = { ...prev };

      if (!updatedCart[productId]) {
        return updatedCart;
      }

      if (updatedCart[productId].quantity > 1) {
        updatedCart[productId] = {
          ...updatedCart[productId],
          quantity: updatedCart[productId].quantity - 1,
        };
      } else {
        delete updatedCart[productId];
      }

      return updatedCart;
    });
  };

  const deleteFromCart = (productId) => {
    setCart((prev) => {
      const updatedCart = { ...prev };

      delete updatedCart[productId];

      return updatedCart;
    });
  };

  const clearCart = () => {
    setCart({});
  };

  const cartItems = Object.values(cart);

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const openCheckout = () => {
    setIsCheckoutOpen(true);
  };

  const closeCheckout = () => {
    setIsCheckoutOpen(false);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartItems,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        deleteFromCart,
        clearCart,
        isCheckoutOpen,
        openCheckout,
        closeCheckout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}