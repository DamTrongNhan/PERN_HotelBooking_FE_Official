import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
    Box,
    Container,
    Paper,
    Button,
    Typography,
    IconButton,
    Unstable_Grid2 as Grid,
    List,
    ListItem,
    ListItemText,
    Divider,
} from '@mui/material';
import { DoneOutline, Clear } from '@mui/icons-material';
import Cookies from 'js-cookie';

import { FormattedMessage } from 'react-intl';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

import LoadingOverlay from 'components/common/LoadingOverlay';

import useAxiosPrivate from 'hooks/useAxiosPrivate';
import { WithBookingIsAuthenticatedGuard } from 'hoc/WithBookingIsAuthenticatedGuard';
import { getBookingByBookingCodeService } from 'services/bookingsService';
import { repaymentService } from 'services/bookingsVnpayService';

import { GUEST_PATHS, NOT_FOUND, LANGUAGES, formatCurrencyUSD, formatCurrencyVND } from 'utils';

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

    const [roomDetails, setRoomDetails] = useState([]);
    const [bookingDetails, setBookingDetails] = useState([]);
    const [bookingDetailsExtra, setBookingDetailsExtra] = useState([]);
    const [paymentDetails, setPaymentDetails] = useState([]);
    const [userDetails, setUserDetails] = useState([]);

    const getBooking = async bookingCode => {
        try {
            setIsLoading(true);

            const response = await getBookingByBookingCodeService(axiosPrivate, bookingCode);
            if (response?.data?.data) {
                const bookingData = response.data.data;
                setBooking(bookingData);
                console.log(bookingData);

                const roomDetailsData = [
                    {
                        primary:
                            LANGUAGES.VI === language
                                ? bookingData?.roomDataBookings?.roomTypeDataRooms?.valueVi
                                : bookingData?.roomDataBookings?.roomTypeDataRooms?.valueEn,
                        secondary: <FormattedMessage id="guest.booking.reviewBooking.roomType" />,
                    },
                    // {
                    //     primary:
                    //         language === LANGUAGES.VI
                    //             ? formatCurrencyVND(bookingData?.roomDataBookings.roomTypesDataRooms?.pricePerNight)
                    //             : formatCurrencyUSD(bookingData?.roomDataBookings.roomTypesDataRooms?.pricePerNight),
                    //     secondary: <FormattedMessage id="guest.booking.reviewBooking.pricePerNight" />,
                    // },
                    {
                        primary: bookingData.bookingCode,
                        secondary: <FormattedMessage id="dashboardAdmin.bookings.details.bookingCode" />,
                    },
                    {
                        primary: dayjs(bookingData.createdAt).format('DD-MM-YYYY HH:mm:ss'),
                        secondary: <FormattedMessage id="dashboardAdmin.bookings.details.timeCreated" />,
                    },
                ];

                const bookingDetailsData = [
                    {
                        primary: dayjs(bookingData.checkIn).format('DD/MM/YYYY'),
                        secondary: <FormattedMessage id="guest.booking.reviewBooking.checkIn" />,
                    },
                    {
                        primary: dayjs(bookingData.checkOut).format('DD/MM/YYYY'),
                        secondary: <FormattedMessage id="guest.booking.reviewBooking.checkOut" />,
                    },
                ];
                const bookingDetailsExtraData = [
                    {
                        primary: bookingData?.roomDataBookings?.number,
                        secondary: <FormattedMessage id="guest.booking.reviewBooking.roomNumber" />,
                    },
                    {
                        primary: bookingData?.days,
                        secondary: <FormattedMessage id="guest.booking.reviewBooking.days" />,
                    },
                    {
                        primary: bookingData?.adult,
                        secondary: <FormattedMessage id="guest.booking.reviewBooking.adult" />,
                    },
                    {
                        primary: bookingData?.child,
                        secondary: <FormattedMessage id="guest.booking.reviewBooking.child" />,
                    },
                ];

                const paymentDetailsData = [
                    {
                        primary:
                            LANGUAGES.VI === language
                                ? bookingData?.paymentData?.paymentTypeData?.valueVi
                                : bookingData?.paymentData?.paymentTypeData?.valueEn,
                        secondary: <FormattedMessage id="guest.booking.reviewBooking.paymentType" />,
                    },
                    {
                        primary:
                            LANGUAGES.VI === language
                                ? bookingData?.paymentData?.paymentStatusData?.valueVi
                                : bookingData?.paymentData?.paymentStatusData?.valueEn,
                        secondary: <FormattedMessage id="guest.booking.reviewBooking.paymentStatus" />,
                    },
                ];

                const userDetailsData = [
                    {
                        primary:
                            LANGUAGES.VI === language
                                ? `${bookingData.lastName} ${bookingData.firstName}`
                                : `${bookingData.firstName} ${bookingData.lastName}`,
                        secondary: <FormattedMessage id="guest.booking.enterInformation.name" />,
                    },
                    {
                        primary: bookingData.email,
                        secondary: <FormattedMessage id="guest.booking.enterInformation.email" />,
                    },
                    {
                        primary: bookingData.phone,
                        secondary: <FormattedMessage id="guest.booking.enterInformation.phone" />,
                    },
                    {
                        primary: bookingData.country,
                        secondary: <FormattedMessage id="guest.booking.enterInformation.country" />,
                    },
                    {
                        primary: bookingData.CIC,
                        secondary: <FormattedMessage id="guest.booking.enterInformation.CIC" />,
                    },
                ];
                setRoomDetails(roomDetailsData);
                setBookingDetails(bookingDetailsData);
                setBookingDetailsExtra(bookingDetailsExtraData);
                setPaymentDetails(paymentDetailsData);
                setUserDetails(userDetailsData);
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

                        <List disablePadding>
                            <ListItem sx={{ py: 1, px: 0 }}>
                                <Grid container spacing={2} xs={12} lg={12}>
                                    <Grid xs={12} lg={6}>
                                        <ListItemText
                                            primary={
                                                LANGUAGES.VI === language
                                                    ? booking?.bookingStatusData?.valueVi
                                                    : booking?.bookingStatusData?.valueEn
                                            }
                                            secondary={
                                                <FormattedMessage id="dashboardAdmin.bookings.details.bookingStatus" />
                                            }
                                        />
                                    </Grid>

                                    {booking?.cancelTime && (
                                        <Grid xs={12} lg={6}>
                                            <ListItemText
                                                primary={dayjs(booking.cancelTime).format('DD/MM/YYYY HH:mm:ss')}
                                                secondary={
                                                    <FormattedMessage id="dashboardAdmin.bookings.details.cancelTime" />
                                                }
                                            />
                                        </Grid>
                                    )}
                                </Grid>
                            </ListItem>

                            <ListItem sx={{ py: 1, px: 0 }}>
                                <Grid container spacing={2} xs={12} lg={12}>
                                    {roomDetails &&
                                        roomDetails.map((item, index) => (
                                            <Grid key={index} xs={12} lg={6}>
                                                <ListItemText primary={item.primary} secondary={item.secondary} />
                                            </Grid>
                                        ))}
                                </Grid>
                            </ListItem>
                            <Divider />

                            <ListItem sx={{ py: 1, px: 0 }}>
                                <Grid container spacing={2} xs={12} lg={12}>
                                    {bookingDetails &&
                                        bookingDetails.map((item, index) => (
                                            <Grid key={index} xs={12} lg={6}>
                                                <ListItemText primary={item.primary} secondary={item.secondary} />
                                            </Grid>
                                        ))}
                                </Grid>
                            </ListItem>
                            <ListItem>
                                <Grid container spacing={2} xs={12} lg={12}>
                                    {bookingDetailsExtra &&
                                        bookingDetailsExtra.map((item, index) => (
                                            <Grid key={index} xs={6} lg={3}>
                                                <ListItemText primary={item.primary} secondary={item.secondary} />
                                            </Grid>
                                        ))}
                                </Grid>
                            </ListItem>

                            <Divider />
                            <ListItem sx={{ py: 1, px: 0 }}>
                                <ListItemText primary="Total" />
                                {/* <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                    {language === LANGUAGES.VI
                                        ? formatCurrencyVND(booking?.totalPrice)
                                        : formatCurrencyUSD(booking?.totalPrice)}
                                </Typography> */}
                            </ListItem>
                        </List>

                        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                            <FormattedMessage id="guest.booking.reviewBooking.paymentDetails" />
                        </Typography>
                        <Divider />

                        <List>
                            <ListItem sx={{ py: 1, px: 0 }}>
                                <Grid container spacing={2} xs={12} lg={12}>
                                    {paymentDetails &&
                                        paymentDetails.map((item, index) => (
                                            <Grid key={index} xs={12} lg={6}>
                                                <ListItemText primary={item.primary} secondary={item.secondary} />
                                            </Grid>
                                        ))}
                                </Grid>
                            </ListItem>
                        </List>

                        <Typography variant="h6" gutterBottom>
                            <FormattedMessage id="guest.booking.reviewBooking.information" />
                        </Typography>
                        <Divider />

                        <List>
                            <ListItem sx={{ py: 1, px: 0 }}>
                                <Grid container spacing={2} xs={12} lg={12}>
                                    {userDetails &&
                                        userDetails.map((item, index) => (
                                            <Grid key={index} xs={12} lg={6}>
                                                <ListItemText primary={item.primary} secondary={item.secondary} />
                                            </Grid>
                                        ))}
                                </Grid>
                            </ListItem>
                        </List>

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
