import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
const CartContext = createContext();
// Change this line in both AuthContext.js and CartContext.js

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null);
    const { token } = useAuth();
    const navigate = useNavigate(); // Add this line

    // Make sure this port number matches your backend server
    // Change this line in both AuthContext.js and CartContext.js
    const API_URL = 'https://ourbeautyapi.runasp.net';

    const fetchCart = useCallback(async () => {
        if (!token) {
            setCart(null); // Clear the cart if the user logs out
            return;
        };

        try {
            const response = await fetch(`${API_URL}/api/Cart`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setCart(data);
            }
        } catch (error) {
            console.error("Failed to fetch cart:", error);
        }
    }, [token]);

    // Fetch the cart when the token changes (e.g., on login)
    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const addToCart = async (productId, quantity = 1) => {
        if (!token) {
            toast.error("Please log in to add items to your cart."); // Replace alert
            return;
        }
        try {
            // This URL should correctly resolve to /api/Cart/items...
            await fetch(`${API_URL}/api/Cart/items?productId=${productId}&quantity=${quantity}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            fetchCart();
            toast.success("Item added to cart!"); // Add a success toast
        } catch (error) {
            console.error("Failed to add item to cart:", error);
            toast.error("Failed to add item."); // Add an error toast
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
            fetchCart(); // Re-fetch the cart to show the changes
        } catch (error) {
            console.error("Failed to remove item from cart:", error);
        }
    };
    const placeOrder = async () => {
        if (!token) {
            alert("Please log in to place an order.");
            return;
        }
        try {
            const response = await fetch(`${API_URL}/api/Orders`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                alert("Order placed successfully!");
                fetchCart(); // This will fetch the now-empty cart
                navigate('/order-success'); // Redirect to a success page
            } else {
                alert("Failed to place order.");
            }
        } catch (error) {
            console.error("Failed to place order:", error);
        }
    };


    const value = {
        cart,
        addToCart,
        removeFromCart,
        placeOrder, // Expose the new function here
    };


   
    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};