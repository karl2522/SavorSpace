import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

const PrivateRoute = ({ element, isAuthenticated, role, path }) => {
    const isPublicAdminRoute = ['/admin/login', '/admin/signup'].includes(path);
    const isAdminRoute = path.startsWith('/admin');

    if (isAuthenticated) {
        // Check if trying to access admin routes without admin role
        if (isAdminRoute && role !== 'ADMIN') {
            return <Navigate to="/404" />;
        }
        // Allow access to the requested page
        return element;
    }

    // If user is not authenticated
    if (!isAuthenticated) { 
        // Allow access to public admin routes
        if (isPublicAdminRoute) {
            return element;
        }
        // For non-admin routes, redirect to login
        return <Navigate to="/login" />;
    }

    return <Navigate to="/404" />;
};

PrivateRoute.propTypes = {
    element: PropTypes.element.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    role: PropTypes.string,
    path: PropTypes.string.isRequired,
};

export default PrivateRoute;