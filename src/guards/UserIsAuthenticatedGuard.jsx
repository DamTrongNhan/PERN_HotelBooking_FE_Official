import { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { AUTH_PATHS } from 'utils';

export const UserIsAuthenticatedGuard = props => {
    const { children } = props;
    const navigate = useNavigate();
    const { isLoggedIn, userInfo } = useSelector(state => state.auth);

    const ignore = useRef(false);
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        // Prevent from calling twice in development mode with React.StrictMode enabled
        if (ignore.current) {
            return;
        }

        ignore.current = true;
        if (!isLoggedIn || !userInfo?.roleKey === 'R2') {
            toast.error('Not authenticated, redirecting');
            navigate(AUTH_PATHS.SIGN_IN);
        } else {
            setChecked(true);
        }
    }, [isLoggedIn, navigate, userInfo]);

    if (!checked) {
        return null;
    }
    return children;
};

UserIsAuthenticatedGuard.propTypes = {
    children: PropTypes.node
};
