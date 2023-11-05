import { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export const UserIsNotAuthenticatedGuard = props => {
    const { children } = props;
    const navigate = useNavigate();
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
    const location = useLocation();

    const ignore = useRef(false);
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        // Prevent from calling twice in development mode with React.StrictMode enabled
        if (ignore.current) {
            return;
        }

        ignore.current = true;
        if (isLoggedIn) {
            const redirectPath = new URLSearchParams(location.search).get('redirect') || '/';
            navigate(redirectPath);
        } else {
            setChecked(true);
        }
    }, [isLoggedIn, location.search, navigate]);

    if (!checked) {
        return null;
    }
    return children;
};

UserIsNotAuthenticatedGuard.propTypes = {
    children: PropTypes.node
};
