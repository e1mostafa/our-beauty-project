import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast'; // 1. Import toast
// Create the context
const AuthContext = createContext();

// Create a custom hook to use the auth context easily
export const useAuth = () => {
    return useContext(AuthContext);
};

// Create the AuthProvider component
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const navigate = useNavigate();

    // The base URL of your API. Make sure the port number matches your backend server.
    // Change this line in both AuthContext.js and CartContext.js
    const API_URL = 'https://ourbeautyapi.runasp.net';

    useEffect(() => {
        // This effect runs when the component mounts
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    const login = async (email, password) => {
        try {
            const response = await fetch(`${API_URL}/api/accounts/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                setToken(data.token);
                toast.success('Logged in successfully!'); // 2. Replace alert
                navigate('/'); // Redirect to homepage after login
            } else {
                toast.error('Login failed. Please check your credentials.'); // 2. Replace alert
            }
        } catch (error) {
            console.error("Login Error:", error);
            toast.error('Could not connect to the server.'); // 2. Replace alert
        }
    };

    const register = async (email, password) => {
        try {
            const response = await fetch(`${API_URL}/api/accounts/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                toast.success('Registration successful! Please log in.'); // 2. Replace aler
                navigate('/login'); // Redirect to login page after registration
            } else {
                toast.error('Registration failed. Please try again.'); // 2. Replace alert
            }
        } catch (error) {
            console.error("Registration Error:", error);
            toast.error('Could not connect to the server.'); // 2. Replace alert
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        toast.success('Logged out.'); // Optional: add a logout toast
        navigate('/login');
    };

    const value = {
        token,
        login,
        register,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};