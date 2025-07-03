import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, CardMedia, CardContent, Typography, Box, CircularProgress, TextField, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const API_URL = 'https://ourbeautyapi.runasp.net';// Make sure this port is correct

    const fetchProducts = async (term) => {
        setLoading(true);
        let url = `${API_URL}/api/products`;
        if (term) {
            url += `?searchTerm=${encodeURIComponent(term)}`;
        }

        try {
            const response = await fetch(url);
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts('');
    }, []);

    const handleSearch = () => {
        fetchProducts(searchTerm);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container sx={{ py: 8 }} maxWidth="lg">
            <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
                Featured Products
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 5 }}>
                <TextField
                    label="Search Products..."
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    sx={{ width: '60%' }}
                />
                <Button variant="contained" onClick={handleSearch} sx={{ ml: 1, px: 4 }}>
                    Search
                </Button>
            </Box>

            <Grid container spacing={4}>
                {products.map((product) => (
                    <Grid item key={product.id} xs={12} sm={6} md={3}>
                        <RouterLink to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out', '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 8px 25px rgba(0,0,0,0.15)' } }}>
                                <CardMedia
                                    component="img"
                                    sx={{ height: 200, objectFit: 'cover' }}
                                    // --- THIS IS THE FIX ---
                                    // We add the API_URL to the relative image path
                                    image={`${API_URL}${product.imageUrl}`}
                                    alt={product.name}
                                />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography gutterBottom variant="h6" component="h2">
                                        {product.name}
                                    </Typography>
                                    <Typography sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                        EGP {product.price.toFixed(2)}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </RouterLink>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default ProductList;