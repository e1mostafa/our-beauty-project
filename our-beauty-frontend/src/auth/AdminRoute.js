import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode'; // We need a library to decode the token

const AdminRoute = ({ children }) => {
    const { token } = useAuth();

    if (!token) {
        // If no token, not logged in, redirect to login
        return <Navigate to="/login" />;
    }

    try {
        const decodedToken = jwtDecode(token);
        // The role claim in our .NET JWT is: "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        const userRole = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

        if (userRole && userRole.includes('Admin')) {
            // If user has the Admin role, show the page
            return children;
        }
    } catch (error) {
        console.error("Invalid token:", error);
        // If token is invalid, redirect to login
        return <Navigate to="/login" />;
    }

    // If user is not an Admin, redirect to the homepage
    return <Navigate to="/" />;
};

export default AdminRoute;