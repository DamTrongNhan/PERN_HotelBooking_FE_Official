import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import { Box, Button, Container, Typography, Link, useTheme } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';

import { toast } from 'react-toastify';
import { FormattedMessage } from 'react-intl';

import SignInToContinue from 'assets/image/signInToContinue.png';

import { AUTH_PATHS } from 'utils';

export const BookingIsAuthenticatedGuard = props => {
    const { children } = props;
    const navigate = useNavigate();

    const { isLoggedIn } = useSelector(state => state.auth);

    const ignore = useRef(false);
    const [checked, setChecked] = useState(false);

    const theme = useTheme();
    const alt = theme.palette.background.alt;

    useEffect(() => {
        // Prevent from calling twice in development mode with React.StrictMode enabled
        if (ignore.current) {
            return;
        }
        ignore.current = true;

        if (!isLoggedIn) {
            toast.error('Sign in to continue');
        } else {
            setChecked(true);
        }
    }, [isLoggedIn]);

    if (!checked) {
        return (
            <>
                <Box
                    backgroundColor={alt}
                    component="main"
                    sx={{
                        alignItems: 'center',
                        display: 'flex',
                        flexGrow: 1,
                        minHeight: '100%',
                        height: '100vh',
                    }}
                >
                    <Container maxWidth="md">
                        <Box
                            sx={{
                                alignItems: 'center',
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Box
                                sx={{
                                    mb: 3,
                                    textAlign: 'center',
                                }}
                            >
                                <img
                                    alt="Under development"
                                    src={SignInToContinue}
                                    style={{
                                        display: 'inline-block',
                                        maxWidth: '100%',
                                        width: 400,
                                    }}
                                />
                            </Box>
                            <Typography align="center" sx={{ mb: 3 }} variant="h3">
                                <FormattedMessage id="guest.signInToContinue.title" />
                            </Typography>

                            <Button endIcon={<ArrowForward />} sx={{ mt: 3 }} variant="contained" color="info">
                                <Link
                                    sx={{ color: 'white' }}
                                    onClick={() => navigate(AUTH_PATHS.SIGN_IN)}
                                    underline="none"
                                >
                                    <FormattedMessage id="guest.signInToContinue.btn" />
                                </Link>
                            </Button>
                        </Box>
                    </Container>
                </Box>
            </>
        );
    }
    return <>{children}</>;
};

BookingIsAuthenticatedGuard.propTypes = {
    children: PropTypes.node,
};
