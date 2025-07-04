import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import toast from 'react-hot-toast';

const CheckoutForm = ({ clientSecret }) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);

    const API_URL = process.env.REACT_APP_API_URL;

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements) return;
        setIsProcessing(true);

        // 1. Confirm the payment with Stripe
        const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(clientSecret);

        if (paymentError) {
            toast.error(paymentError.message);
            setIsProcessing(false);
            return;
        }

        if (paymentIntent.status === 'succeeded') {
            // 2. If payment succeeded, create the order in our database
            try {
                const orderResponse = await fetch(`${API_URL}/api/Orders`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (orderResponse.ok) {
                    toast.success("Payment successful and order placed!");
                    navigate('/order-success');
                } else {
                    toast.error("Payment succeeded, but failed to create order.");
                }
            } catch (orderError) {
                toast.error("An error occurred while creating your order.");
            }
        }
        setIsProcessing(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            <Typography variant="h6" gutterBottom>Card Details</Typography>
            <Box sx={{ border: '1px solid #ccc', padding: '10px', borderRadius: '4px' }}>
                <CardElement />
            </Box>
            <Button
                type="submit"
                disabled={!stripe || isProcessing}
                fullWidth
                variant="contained"
                sx={{ mt: 3 }}
            >
                {isProcessing ? 'Processing...' : 'Pay Now'}
            </Button>
        </form>
    );
};

export default CheckoutForm;