import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Box, Container, Paper, Button, Typography, IconButton, Unstable_Grid2 as Grid } from '@mui/material';
import { DoneOutline, Clear } from '@mui/icons-material';
import Cookies from 'js-cookie';

import { FormattedMessage } from 'react-intl';
import { toast } from 'react-toastify';

import LoadingOverlay from 'components/common/LoadingOverlay';

import useAxiosPrivate from 'hooks/useAxiosPrivate';
import { WithBookingIsAuthenticatedGuard } from 'hoc/WithBookingIsAuthenticatedGuard';
import { getBookingByBookingCodeService } from 'services/bookingsService';
import { repaymentService } from 'services/bookingsVnpayService';

import { GUEST_PATHS, NOT_FOUND, LANGUAGES } from 'utils';

const VerifyBooking = WithBookingIsAuthenticatedGuard(() => {
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const ignore = useRef(false);

    const language = useSelector(state => state.app.language);

    const [booking, setBooking] = useState({});
    const [status, setStatus] = useState(false);
    const [messageVi, setMessageVi] = useState('');
    const [messageEn, setMessageEn] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const getBooking = async bookingCode => {
        try {
            setIsLoading(true);

            const response = await getBookingByBookingCodeService(axiosPrivate, bookingCode);
            if (response?.data?.data) {
                setBooking(response.data.data);
            } else {
                setStatus(false);
                setMessageVi('Không tìm thấy đơn');
                setMessageEn('No order found');
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error(error.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const repayment = async () => {
        try {
            setIsLoading(true);

            const response = await repaymentService(axiosPrivate, booking);
            if (response?.data?.paymentUrl) {
                window.open(response.data.paymentUrl, '_self');
            } else {
                setIsLoading(false);
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error(error.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (ignore.current) return;
        ignore.current = true;

        const paymentStatus = Cookies.get('paymentStatus');

        if (paymentStatus) {
            const { bookingCode = '', isSuccess = false } = JSON.parse(paymentStatus);
            if (isSuccess) {
                setStatus(true);
                setMessageEn('The order has been paid');
                setMessageVi('Đơn hàng đã được thanh toán');
            } else {
                setMessageVi('Đơn của bạn chưa được thanh toán do nguyên nhân lỗi hoặc lí do khác');
                setMessageEn('Your order has not been paid due to an error or other reasons.');
            }
            getBooking(bookingCode);
        } else {
            navigate(NOT_FOUND);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <LoadingOverlay isLoading={isLoading} />

            <Box sx={{ flex: '1 1 auto' }}>
                <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
                    <Paper elevation={3} sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                        <Typography component="h1" variant="h4" align="center">
                            <FormattedMessage id="guest.paymentStatus.title" />
                        </Typography>

                        <Box mt={2} display="flex" justifyContent="center">
                            <IconButton>
                                {status ? <DoneOutline color="success" /> : <Clear color="error" />}
                            </IconButton>
                        </Box>

                        <Typography align="center" variant="subtitle1" gutterBottom>
                            <FormattedMessage id="guest.booking.bookingCode" />
                            {booking?.bookingCode}
                        </Typography>

                        <Typography align="center" variant="h2" color={status ? 'success' : 'error'} gutterBottom>
                            <FormattedMessage
                                id={status ? 'guest.paymentStatus.paid' : 'guest.paymentStatus.notPaid'}
                            />
                        </Typography>

                        <Typography align="center" variant="h2" color={status ? 'success' : 'error'} gutterBottom>
                            {LANGUAGES.VI === language ? messageVi : messageEn}
                        </Typography>

                        <Grid container mt={2} spacing={3} justifyContent="center">
                            <Grid>
                                <Button onClick={() => navigate(GUEST_PATHS.GUEST)} variant="contained" color="primary">
                                    <FormattedMessage id="guest.booking.homePage" />
                                </Button>
                            </Grid>
                            {!status && (
                                <Grid>
                                    <Button
                                        onClick={() => {
                                            repayment();
                                        }}
                                        variant="contained"
                                        color="secondary"
                                    >
                                        <FormattedMessage id="guest.paymentStatus.repayment" />
                                    </Button>
                                </Grid>
                            )}
                        </Grid>
                    </Paper>
                </Container>
            </Box>
        </>
    );
});

export default VerifyBooking;
