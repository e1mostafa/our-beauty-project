import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null);
    const { token, logout } = useAuth(); // Get the logout function from AuthContext
    const navigate = useNavigate();

    const API_URL = process.env.REACT_APP_API_URL;

    const fetchCart = useCallback(async () => {
        if (!token) {
            setCart(null);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/Cart`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setCart(data);
            } else if (response.status === 401) {
                // --- THIS IS THE IMPROVEMENT ---
                // If the token is invalid, log the user out automatically.
                toast.error("Your session has expired. Please log in again.");
                logout();
            }
        } catch (error) {
            console.error("Failed to fetch cart:", error);
        }
    }, [token, logout, API_URL]); // Added dependencies

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const addToCart = async (productId, quantity = 1) => {
        if (!token) {
            toast.error("Please log in to add items to your cart.");
            return;
        }
        try {
            const response = await fetch(`${API_URL}/api/Cart/items?productId=${productId}&quantity=${quantity}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                fetchCart();
                toast.success("Item added to cart!");
            } else {
                toast.error("Failed to add item.");
            }
        } catch (error) {
            console.error("Failed to add item to cart:", error);
            toast.error("Failed to add item.");
        }
    };

    const removeFromCart = async (productId) => {
        if (!token) return;
        try {
            await fetch(`${API_URL}/api/Cart/items/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            fetchCart();
        } catch (error) {
            console.error("Failed to remove item from cart:", error);
        }
    };

    const placeOrder = async (paymentMethod) => {
        if (!token) {
            toast.error("Please log in to place an order.");
            return;
        }
        try {
            const response = await fetch(`${API_URL}/api/Orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ paymentMethod })
            });

            if (response.ok) {
                toast.success("Order placed successfully!");
                fetchCart();
                navigate('/order-success');
            } else {
                toast.error("Failed to place order.");
            }
        } catch (error) {
            console.error("Failed to place order:", error);
            toast.error("An error occurred while placing your order.");
        }
    };

    const value = {
        cart,
        addToCart,
        removeFromCart,
        placeOrder,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
