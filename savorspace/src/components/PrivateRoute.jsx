import { Navigate } from "react-router-dom";
import PropTypes, { element } from "prop-types";

const PrivateRoute = ({element, isAuthenticated, role, path}) => {

    const isPublicAdminRoute = ['/admin/login', '/admin/signup'].includes(path);

    if(isAuthenticated && (isPublicAdminRoute && role === 'ADMIN')) {
        return element;
    }else if(!isAuthenticated && isPublicAdminRoute) {
        return element;
    }else {
        return <Navigate to={isAuthenticated ? '/404' : '/login'} />; 
    }
};

PrivateRoute.propTypes = {

    element: PropTypes.element.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    role: PropTypes.string,
    path: PropTypes.string.isRequired,
};

export default PrivateRoute;