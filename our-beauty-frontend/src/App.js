import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { createTheme } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';

// Import Providers
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Import Route Guards
import ProtectedRoute from './auth/ProtectedRoute';
import AdminRoute from './auth/AdminRoute';

// Import Components and Pages
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CheckoutPage from './pages/CheckoutPage'; // Import the correct checkout page
import OrderSuccessPage from './pages/OrderSuccessPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import AdminProductList from './pages/AdminProductList';
import AdminProductEdit from './pages/AdminProductEdit';

// Import MUI components
import { CssBaseline, ThemeProvider } from '@mui/material';

// Define your theme
const LinkBehavior = React.forwardRef((props, ref) => (
    <RouterLink ref={ref} to={props.href} {...props} />
));

const theme = createTheme({
    palette: {
        primary: {
            main: '#D4A5A5', // A dusty rose color
        },
        secondary: {
            main: '#37474F', // A dark, cool grey for text
        },
        background: {
            default: '#F9F5F2', // A very light, warm beige
        },
    },
    typography: {
        fontFamily: '"Lato", "Helvetica", "Arial", sans-serif',
        h4: {
            fontFamily: '"Playfair Display", serif', // An elegant serif font for main titles
            fontWeight: 700,
        },
        h5: {
            fontFamily: '"Playfair Display", serif',
            fontWeight: 700,
        },
        h6: {
            fontFamily: '"Playfair Display", serif',
        },
    },
    // This makes MUI Buttons that use `component="a"` use React Router's Link
    components: {
        MuiLink: {
            defaultProps: {
                component: LinkBehavior,
            },
        },
        MuiButtonBase: {
            defaultProps: {
                LinkComponent: LinkBehavior,
            },
        },
    },
});
function App() {
    return (
        <ThemeProvider theme={theme}>
            <Router>
                <AuthProvider>
                    <CartProvider>
                        <Toaster position="top-center" reverseOrder={false} />
                        <CssBaseline />
                        <Navbar />
                        <main>
                            <Routes>
                                {/* Public Routes */}
                                <Route path="/" element={<HomePage />} />
                                <Route path="/product/:id" element={<ProductPage />} />
                                <Route path="/login" element={<LoginPage />} />
                                <Route path="/register" element={<RegisterPage />} />
                                <Route path="/order-success" element={<OrderSuccessPage />} />

                                {/* Protected Routes for logged-in users */}
                                <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
                                <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                                <Route path="/my-orders" element={<ProtectedRoute><OrderHistoryPage /></ProtectedRoute>} />

                                {/* Admin Routes */}
                                <Route path="/admin/products" element={<AdminRoute><AdminProductList /></AdminRoute>} />
                                <Route path="/admin/products/new" element={<AdminRoute><AdminProductEdit /></AdminRoute>} />
                                <Route path="/admin/products/edit/:id" element={<AdminRoute><AdminProductEdit /></AdminRoute>} />
                            </Routes>
                        </main>
                        <Footer />
                    </CartProvider>
                </AuthProvider>
            </Router>
        </ThemeProvider>
    );
}

export default App;