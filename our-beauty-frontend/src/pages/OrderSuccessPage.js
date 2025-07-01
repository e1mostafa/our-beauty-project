import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const OrderSuccessPage = () => {
    return (
        <Container sx={{ py: 8, textAlign: 'center' }}>
            <Box>
                <CheckCircleOutlineIcon sx={{ fontSize: 80, color: 'success.main' }} />
                <Typography variant="h4" gutterBottom sx={{ mt: 2, fontWeight: 'bold' }}>
                    Thank You for Your Order!
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    Your order has been placed successfully.
                </Typography>
                <Button component={Link} to="/" variant="contained" sx={{ mt: 4 }}>
                    Continue Shopping
                </Button>
            </Box>
        </Container>
    );
};

export default OrderSuccessPage;