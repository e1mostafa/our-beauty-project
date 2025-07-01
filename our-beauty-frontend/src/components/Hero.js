import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Hero = () => {
    // The address of your running backend server
    const API_URL = 'https://localhost:7157'; // Make sure this port is correct

    // The relative path to your new image in the wwwroot folder
    const heroImageUrl = '/images/hero-background.png';

    return (
        <Box sx={{
            position: 'relative',
            height: '70vh', // A nice, tall hero section
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            // Construct the full URL for the background image
            backgroundImage: `url(${API_URL}${heroImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }}>
            {/* Dark Overlay to make the text readable */}
            <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }} />

            {/* Hero Section Content */}
            <Container maxWidth="md" sx={{ position: 'relative' }}>
                <Typography
                    variant="h2"
                    component="h1"
                    gutterBottom
                    sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 'bold' }}
                >
                    Discover Your Inner Radiance
                </Typography>
                <Typography variant="h5" component="p" paragraph>
                    High-quality cosmetics and skincare for the modern look.
                </Typography>
                <Button
                    component={RouterLink}
                    to="/" // You can change this link to go to a specific products page
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{ mt: 2, px: 5, py: 1.5, fontSize: '1.1rem' }}>
                    Shop Collection
                </Button>
            </Container>
        </Box>
    );
};

export default Hero;