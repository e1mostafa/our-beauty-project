import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Container, Typography, Accordion, AccordionSummary, AccordionDetails, Box, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const OrderHistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();
    const API_URL = 'https://ourbeautyapi.runasp.net'; // Make sure this port is correct

    useEffect(() => {
        const fetchOrders = async () => {
            if (!token) return;
            try {
                const response = await fetch(`${API_URL}/api/orders/my-orders`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setOrders(data);
                }
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [token]);

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}><CircularProgress /></Box>;
    }

    return (
        <Container sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>My Orders</Typography>
            {orders.length === 0 ? (
                <Typography>You have not placed any orders yet.</Typography>
            ) : (
                orders.map(order => (
                    <Accordion key={order.id}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                Order #{order.id}
                            </Typography>
                            <Typography sx={{ width: '33%', color: 'text.secondary' }}>
                                Date: {new Date(order.orderDate).toLocaleDateString()}
                            </Typography>
                            <Typography sx={{ fontWeight: 'bold' }}>
                                Total: EGP {order.totalPrice.toFixed(2)}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <List>
                                {order.orderItems.map(item => (
                                    <ListItem key={item.id}>
                                        <ListItemText
                                            primary={`${item.product.name} (x${item.quantity})`}
                                            secondary={`Price per item: EGP ${item.price.toFixed(2)}`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </AccordionDetails>
                    </Accordion>
                ))
            )}
        </Container>
    );
};

export default OrderHistoryPage;