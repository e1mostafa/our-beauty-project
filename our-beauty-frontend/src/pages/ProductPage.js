import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Grid, Box, Typography, Button, CircularProgress } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const ProductPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const API_URL = 'https://localhost:7157'; // Make sure port is correct

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`${API_URL}/api/products/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setProduct(data);
                } else {
                    console.error("Product not found");
                }
            } catch (error) {
                console.error("Failed to fetch product:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}><CircularProgress /></Box>;
    }

    if (!product) {
        return (
            <Container sx={{ py: 8, textAlign: 'center' }}>
                <Typography variant="h4">Product Not Found</Typography>
            </Container>
        );
    }

    return (
        <Container sx={{ py: 8 }}>
            <Grid container spacing={{ xs: 2, md: 6 }}>
                {/* Image Column */}
                <Grid item xs={12} md={6}>
                    <Box
                        component="img"
                        sx={{
                            width: '100%',
                            borderRadius: '16px',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                        }}
                        src={`${API_URL}${product.imageUrl}`}
                        alt={product.name}
                    />
                </Grid>

                {/* Details Column - THIS IS THE CORRECTED PART */}
                <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Typography variant="h3" component="h1" gutterBottom sx={{ fontFamily: '"Playfair Display", serif', fontWeight: '700' }}>
                        {product.name}
                    </Typography>
                    <Typography variant="h4" color="primary" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                        EGP {product.price.toFixed(2)}
                    </Typography>
                    <Typography variant="body1" paragraph color="text.secondary" sx={{ mb: 4, fontSize: '1.1rem' }}>
                        {product.description}
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={() => addToCart(product.id)}
                        sx={{ width: 'fit-content', py: 1.5, px: 5, fontSize: '1rem' }}
                    >
                        Add to Cart
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ProductPage;