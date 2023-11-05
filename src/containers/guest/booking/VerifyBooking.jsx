import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Container, Paper, Button, Typography, IconButton } from '@mui/material';
import { DoneOutline, Clear } from '@mui/icons-material';

import { toast } from 'react-toastify';
import { FormattedMessage } from 'react-intl';

import LoadingOverlay from 'components/common/LoadingOverlay';

import { WithBookingIsAuthenticatedGuard } from 'hoc/WithBookingIsAuthenticatedGuard';

import useAxiosPrivate from 'hooks/useAxiosPrivate';
import { verifyBookingService } from 'services/bookingsService';

import { GUEST_PATHS } from 'utils';

const VerifyBooking = WithBookingIsAuthenticatedGuard(() => {
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const ignore = useRef(false);

    const [message, setMessage] = useState('');
    const [statusVerify, setStatusVerify] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (ignore.current) {
            return;
        }
        ignore.current = true;

        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const bookingId = urlParams.get('bookingId');
        VerifyBooking(token, bookingId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const VerifyBooking = async (token, bookingId) => {
        try {
            setIsLoading(true);
            const response = await verifyBookingService(axiosPrivate, { token, bookingId });
            if (response?.data) {
                setIsLoading(false);

                setStatusVerify(true);
                setMessage(response?.data?.message);
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
                setMessage(error.response.data.message);
            } else {
                toast.error(error.message);
            }
            setIsLoading(false);

            setStatusVerify(false);
            setMessage(error?.response?.data?.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Box sx={{ flex: '1 1 auto' }}>
                <LoadingOverlay isLoading={isLoading} />

                <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
                    <Paper elevation={3} sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                        <Typography component="h1" variant="h4" align="center">
                            <FormattedMessage id="guest.verifyBooking.title" />
                        </Typography>

                        <Box mt={2} display="flex" justifyContent="center">
                            {statusVerify ? (
                                <IconButton>
                                    <DoneOutline color="success" />
                                </IconButton>
                            ) : (
                                <IconButton>
                                    <Clear color="error" />
                                </IconButton>
                            )}
                        </Box>

                        <Typography align="center" variant="h2" color={statusVerify ? 'success' : 'error'} gutterBottom>
                            {message}
                        </Typography>

                        <Box mt={2} display="flex" justifyContent="center">
                            <Button onClick={() => navigate(GUEST_PATHS.GUEST)} variant="contained" color="primary">
                                <FormattedMessage id="guest.booking.homePage" />
                            </Button>
                        </Box>
                    </Paper>
                </Container>
            </Box>
        </>
    );
});

export default VerifyBooking;
