import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm'; // We will reuse the form component
import { useAuth } from '../context/AuthContext';
import { Typography, CircularProgress, Box } from '@mui/material';

// Load Stripe with your publishable key
const stripePromise = loadStripe('pk_test_51RfvENB0OAQGNsj9DzsXX6bKGBMb4svA7bH2HsI6NCsewJw5ViuzdNFaxd7pwSZfNGNYCg2FruQsR9uUvFHFL35O0011ZFg92k'); // <-- PASTE YOUR PUBLISHABLE KEY HERE

const StripeCheckout = () => {
    const [clientSecret, setClientSecret] = useState('');
    const { token } = useAuth();
    const API_URL = 'https://localhost:7157';

    useEffect(() => {
        const createPaymentIntent = async () => {
            if (!token) return;
            try {
                const response = await fetch(`${API_URL}/api/payments`, {
                    method: "POST",
                    headers: { "Authorization": `Bearer ${token}` },
                });
                const data = await response.json();
                setClientSecret(data.clientSecret);
            } catch (error) {
                console.error("Failed to create payment intent:", error);
            }
        };
        createPaymentIntent();
    }, [token]);

    if (!clientSecret) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
                <CircularProgress size={24} />
                <Typography sx={{ ml: 2 }}>Loading secure payment form...</Typography>
            </Box>
        );
    }

    return (
        <Elements options={{ clientSecret, theme: 'stripe' }} stripe={stripePromise}>
            <CheckoutForm clientSecret={clientSecret} />
        </Elements>
    );
};

export default StripeCheckout;