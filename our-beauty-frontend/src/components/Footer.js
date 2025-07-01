import React from 'react';
import { Container, Grid, Typography, Link, Box, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                backgroundColor: '#F8F0E5', // لون بيج فاتح وأنيق
                p: 6,
                mt: 8, // هامش علوي لفصله عن المحتوى
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={5}>
                    {/* About Section */}
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                            Our Beauty
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Elegance in Every Drop. Your one-stop shop for the finest cosmetics and skincare products.
                        </Typography>
                    </Grid>

                    {/* Quick Links Section */}
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                            Quick Links
                        </Typography>
                        <Link href="#" color="inherit" display="block" sx={{ mb: 1 }}>About Us</Link>
                        <Link href="#" color="inherit" display="block" sx={{ mb: 1 }}>Contact Us</Link>
                        <Link href="#" color="inherit" display="block" sx={{ mb: 1 }}>Shipping & Returns</Link>
                        <Link href="#" color="inherit" display="block">FAQ</Link>
                    </Grid>

                    {/* Follow Us Section */}
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                            Follow Us
                        </Typography>
                        <IconButton href="https://facebook.com" target="_blank" color="inherit">
                            <FacebookIcon />
                        </IconButton>
                        <IconButton href="https://instagram.com" target="_blank" color="inherit">
                            <InstagramIcon />
                        </IconButton>
                    </Grid>
                </Grid>

                {/* Copyright */}
                <Box mt={5}>
                    <Typography variant="body2" color="text.secondary" align="center">
                        {'© '}
                        {new Date().getFullYear()}
                        {' Our Beauty. All Rights Reserved.'}
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;