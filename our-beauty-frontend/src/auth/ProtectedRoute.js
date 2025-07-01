import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { token } = useAuth();
    const location = useLocation();

    if (!token) {
        // If the user is not logged in, redirect them to the login page.
        // We also pass the original location they tried to access,
        // so we can redirect them back after they log in.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If the user is logged in, render the child components (the actual page).
    return children;
};

export default ProtectedRoute;