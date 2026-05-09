import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cartItems");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.productId === product._id);

      if (existing) {
        return prev.map((item) =>
          item.productId === product._id
            ? {
                ...item,
                quantity: Math.min(
                  item.quantity + quantity,
                  Number(product.stock || item.quantity + quantity)
                ),
              }
            : item
        );
      }

      return [
        ...prev,
        {
          productId: product._id,
          name: product.name,
          price: Number(product.price || 0),
          image: product.images?.[0] || "",
          quantity,
          stock: Number(product.stock || 0),
          category: product.category || "",
          sellerId: product.sellerId?._id || "",
          sellerName: product.sellerId?.name || "Marketplace Seller",
        },
      ];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const updateCartQuantity = (productId, quantity) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity: Math.max(1, Math.min(quantity, item.stock || quantity)),
            }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const clearSellerCart = (sellerId) => {
    setCartItems((prev) => prev.filter((item) => item.sellerId !== sellerId));
  };

  const cartCount = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const cartSubtotal = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItems]);

  const groupedCartItems = useMemo(() => {
    const groups = {};

    for (const item of cartItems) {
      const key = item.sellerId || item.sellerName || "unknown-seller";

      if (!groups[key]) {
        groups[key] = {
          sellerId: item.sellerId,
          sellerName: item.sellerName,
          items: [],
          sellerItemCount: 0,
          sellerSubtotal: 0,
        };
      }

      groups[key].items.push(item);
      groups[key].sellerItemCount += item.quantity;
      groups[key].sellerSubtotal += item.price * item.quantity;
    }

    return Object.values(groups);
  }, [cartItems]);

  const getSellerCartById = (sellerId) => {
    return groupedCartItems.find((group) => group.sellerId === sellerId) || null;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        groupedCartItems,
        cartCount,
        cartSubtotal,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        clearSellerCart,
        getSellerCartById,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}