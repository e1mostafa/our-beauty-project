import React from 'react';
import { useCart } from '../context/CartContext';
import { Container, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, Box, Button, CircularProgress, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';

const CartPage = () => {
    const { cart, removeFromCart } = useCart();

    if (!cart) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (cart.items.length === 0) {
        return (
            <Container sx={{ py: 8, textAlign: 'center' }}>
                <Typography variant="h4">Your Cart is Empty</Typography>
                <Button component={Link} to="/" variant="contained" sx={{ mt: 2 }}>
                    Continue Shopping
                </Button>
            </Container>
        );
    }

    const totalPrice = cart.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);

    return (
        <Container sx={{ py: 8 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                Shopping Cart
            </Typography>
            <List>
                {cart.items.map((item) => (
                    <ListItem key={item.id} divider
                        secondaryAction={
                            <IconButton edge="end" aria-label="delete" onClick={() => removeFromCart(item.product.id)}>
                                <DeleteIcon />
                            </IconButton>
                        }
                    >
                        <ListItemAvatar>
                            <Avatar src={item.product.imageUrl} variant="rounded" sx={{ width: 80, height: 80, mr: 3 }} />
                        </ListItemAvatar>
                        <ListItemText
                            primary={item.product.name}
                            secondary={`Quantity: ${item.quantity}`}
                            primaryTypographyProps={{ variant: 'h6' }}
                        />
                        <Typography variant="h6">EGP {(item.product.price * item.quantity).toFixed(2)}</Typography>
                    </ListItem>
                ))}
            </List>
            <Box sx={{ mt: 4, textAlign: 'right' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    Total: EGP {totalPrice.toFixed(2)}
                </Typography>
                <Button component={Link} to="/checkout" variant="contained" color="primary" size="large" sx={{ mt: 2 }}>
                    Proceed to Checkout
                </Button>
            </Box>
        </Container>
    );
};

export default CartPage;