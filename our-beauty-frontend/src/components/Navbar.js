import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box, Badge } from '@mui/material';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { Link as RouterLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';

const Navbar = () => {
    const { cart } = useCart();
    const { token, logout } = useAuth();
    let isAdmin = false;
    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            const userRole = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
            if (userRole && userRole.includes('Admin')) {
                isAdmin = true;
            }
        } catch (error) {
            console.error("Invalid token");
        }
    }
    return (
        <AppBar position="static" sx={{ backgroundColor: 'white', color: '#333', boxShadow: '0 2px 4px 0 rgba(0,0,0,0.1)' }}>
            <Toolbar>
                <Typography variant="h6" component={RouterLink} to="/" sx={{ flexGrow: 1, fontWeight: 'bold', cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}>
                    Our Beauty
                </Typography>

                <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
                    {/* Add this Admin link */}
                    {isAdmin && (
                        <Button component={RouterLink} to="/admin/products" color="inherit" sx={{ fontWeight: 'bold' }}>
                            Admin
                        </Button>
                    )}

                    {token ? (
                        <>
                            {/* Add this "My Orders" button */}
                            <Button component={RouterLink} to="/my-orders" color="inherit" sx={{ fontWeight: 'bold' }}>
                                My Orders
                            </Button>
                            <Button color="inherit" onClick={logout} sx={{ fontWeight: 'bold' }}>Logout</Button>
                        </>
                    ) : (
                        <>
                            <Button component={RouterLink} to="/login" color="inherit" sx={{ fontWeight: 'bold' }}>Login</Button>
                            <Button component={RouterLink} to="/register" color="inherit" sx={{ fontWeight: 'bold' }}>Register</Button>
                        </>
                    )}

                    <IconButton component={RouterLink} to="/cart" color="inherit" sx={{ ml: 2 }}>
                        <Badge badgeContent={cart?.items?.length || 0} color="error">
                            <ShoppingCartOutlinedIcon />
                        </Badge>
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;