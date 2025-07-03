import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Typography, Box, Button, Paper, Divider, Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemText } from '@mui/material';
import toast from 'react-hot-toast';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StripeCheckout from '../components/StripeCheckout'; // Import the new component

const CheckoutPage = () => {
    const { token } = useAuth();
    const { cart, fetchCart } = useCart();
    const navigate = useNavigate();
    const API_URL = 'https://ourbeautyapi.runasp.net';

    const handleOfflineOrder = async (paymentMethod) => {
        if (!token) return toast.error("Please log in to place an order.");

        try {
            const response = await fetch(`${API_URL}/api/Orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
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
            toast.error("An error occurred while placing your order.");
        }
    };

    if (!cart) return <Typography>Loading cart...</Typography>;

    if (cart.items.length === 0) {
        return (
            <Container sx={{ py: 8, textAlign: 'center' }}>
                <Typography variant="h4">Your Cart is Empty</Typography>
                <Button component={Link} to="/" variant="contained" sx={{ mt: 2 }}>Start Shopping</Button>
            </Container>
        );
    }

    const totalPrice = cart.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);

    return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>Checkout</Typography>

            <Paper elevation={3} sx={{ p: 3, mt: 3, mb: 4 }}>
                <Typography variant="h6">Order Summary</Typography>
                <List>
                    {cart.items.map(item => (
                        <ListItem key={item.id} disablePadding>
                            <ListItemText primary={`${item.product.name} (x${item.quantity})`} />
                            <Typography>EGP {(item.product.price * item.quantity).toFixed(2)}</Typography>
                        </ListItem>
                    ))}
                </List>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Total</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>EGP {totalPrice.toFixed(2)}</Typography>
                </Box>
            </Paper>

            <Typography variant="h5" gutterBottom>Choose Your Payment Method</Typography>

            {/* Option 1: Pay with Card */}
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Pay with Card (Stripe)</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <StripeCheckout />
                </AccordionDetails>
            </Accordion>

            {/* Option 2: Cash on Delivery */}
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Cash on Delivery</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography sx={{ mb: 2 }}>You will pay the courier upon receiving your order.</Typography>
                    <Button fullWidth variant="contained" onClick={() => handleOfflineOrder('Cash on Delivery')}>
                        Confirm Order
                    </Button>
                </AccordionDetails>
            </Accordion>

            {/* Option 3: Vodafone Cash */}
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Vodafone Cash</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography sx={{ mb: 2 }}>After confirming, you will receive payment instructions.</Typography>
                    <Button fullWidth variant="contained" color="error" onClick={() => handleOfflineOrder('Vodafone Cash')}>
                        Confirm Order
                    </Button>
                </AccordionDetails>
            </Accordion>
        </Container>
    );
};

export default CheckoutPage;