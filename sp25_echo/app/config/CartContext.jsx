'use client';

import { createContext, useContext, useState, useEffect } from 'react';

// Create Cart Context
const CartContext = createContext();

// Custom Hook to Use Cart
export function useCart() {
    return useContext(CartContext);
}

// Cart Provider Component
export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);

    // Load cart from localStorage on page load
    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem("cart"));
        if (savedCart) setCart(savedCart);
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    // Add item to cart
    const addToCart = (item) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find(cartItem => cartItem.id === item.id && cartItem.size === item.size);
            if (existingItem) {
                return prevCart.map(cartItem =>
                    cartItem.id === item.id && cartItem.size === item.size
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                );
            } else {
                return [...prevCart, { ...item, quantity: 1 }];
            }
        });
    };

    // Remove item from cart
    const removeFromCart = (id, size) => {
        setCart(cart.filter(item => !(item.id === id && item.size === size)));
    };

    // Update item quantity
    const updateQuantity = (id, size, quantity) => {
        setCart(cart.map(item =>
            item.id === id && item.size === size ? { ...item, quantity } : item
        ));
    };

    // Clear cart after checkout
    const clearCart = () => {
        setCart([]);
        localStorage.removeItem("cart");
    }

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}
