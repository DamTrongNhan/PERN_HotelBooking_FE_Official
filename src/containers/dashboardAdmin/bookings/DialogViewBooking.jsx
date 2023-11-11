import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Typography,
    List,
    ListItem,
    ListItemText,
    Divider,
    Unstable_Grid2 as Grid,
} from '@mui/material';
import { Cancel } from '@mui/icons-material';

import * as DOMPurify from 'dompurify';
import { FormattedMessage } from 'react-intl';
import dayjs from 'dayjs';
import _ from 'lodash';

import HeaderComponent from 'components/dashboard/HeaderComponent';

import { LANGUAGES, formatCurrencyUSD, formatCurrencyVND } from 'utils';
import { useEffect, useState } from 'react';

const DialogViewBooking = props => {
    const { openDialogView, handleToggleDialogView, currentBooking = {} } = props;

    const language = useSelector(state => state.app.language || 'vi');

    const [roomDetails, setRoomDetails] = useState([]);
    const [bookingDetails, setBookingDetails] = useState([]);
    const [bookingDetailsExtra, setBookingDetailsExtra] = useState([]);
    const [paymentDetails, setPaymentDetails] = useState([]);
    const [userDetails, setUserDetails] = useState([]);

    useEffect(() => {
        if (openDialogView && !_.isEmpty(currentBooking)) {
            const roomDetailsData = [
                {
                    primary:
                        LANGUAGES.VI === language
                            ? currentBooking?.roomDataBookings?.roomTypeDataRooms?.valueVi
                            : currentBooking?.roomDataBookings?.roomTypeDataRooms?.valueEn,
                    secondary: <FormattedMessage id="guest.booking.reviewBooking.roomType" />,
                },
                {
                    primary:
                        language === LANGUAGES.VI
                            ? formatCurrencyVND(currentBooking?.roomDataBookings.roomTypesDataRooms?.pricePerNight)
                            : formatCurrencyUSD(currentBooking?.roomDataBookings.roomTypesDataRooms?.pricePerNight),
                    secondary: <FormattedMessage id="guest.booking.reviewBooking.pricePerNight" />,
                },
                {
                    primary: currentBooking.bookingCode,
                    secondary: <FormattedMessage id="dashboardAdmin.bookings.details.bookingCode" />,
                },
                {
                    primary: dayjs(currentBooking.createdAt).format('DD-MM-YYYY HH:mm:ss'),
                    secondary: <FormattedMessage id="dashboardAdmin.bookings.details.timeCreated" />,
                },
            ];

            const bookingDetailsData = [
                {
                    primary: dayjs(currentBooking.checkIn).format('DD/MM/YYYY'),
                    secondary: <FormattedMessage id="guest.booking.reviewBooking.checkIn" />,
                },
                {
                    primary: dayjs(currentBooking.checkOut).format('DD/MM/YYYY'),
                    secondary: <FormattedMessage id="guest.booking.reviewBooking.checkOut" />,
                },
            ];
            const bookingDetailsExtraData = [
                {
                    primary: currentBooking?.roomDataBookings?.number,
                    secondary: <FormattedMessage id="guest.booking.reviewBooking.roomNumber" />,
                },
                {
                    primary: currentBooking?.days,
                    secondary: <FormattedMessage id="guest.booking.reviewBooking.days" />,
                },
                {
                    primary: currentBooking?.adult,
                    secondary: <FormattedMessage id="guest.booking.reviewBooking.adult" />,
                },
                {
                    primary: currentBooking?.child,
                    secondary: <FormattedMessage id="guest.booking.reviewBooking.child" />,
                },
            ];

            const paymentDetailsData = [
                {
                    primary:
                        LANGUAGES.VI === language
                            ? currentBooking?.paymentData?.paymentTypeData.valueVi
                            : currentBooking?.paymentData?.paymentTypeData.valueEn,
                    secondary: <FormattedMessage id="guest.booking.reviewBooking.paymentType" />,
                },
                {
                    primary:
                        LANGUAGES.VI === language
                            ? currentBooking?.paymentData?.paymentStatusData.valueVi
                            : currentBooking?.paymentData?.paymentStatusData.valueEn,
                    secondary: <FormattedMessage id="guest.booking.reviewBooking.paymentStatus" />,
                },
            ];

            const userDetailsData = [
                {
                    primary:
                        LANGUAGES.VI === language
                            ? `${currentBooking.lastName} ${currentBooking.firstName}`
                            : `${currentBooking.firstName} ${currentBooking.lastName}`,
                    secondary: <FormattedMessage id="guest.booking.enterInformation.name" />,
                },
                {
                    primary: currentBooking.email,
                    secondary: <FormattedMessage id="guest.booking.enterInformation.email" />,
                },
                {
                    primary: currentBooking.phone,
                    secondary: <FormattedMessage id="guest.booking.enterInformation.phone" />,
                },
                {
                    primary: currentBooking.country,
                    secondary: <FormattedMessage id="guest.booking.enterInformation.country" />,
                },
                {
                    primary: currentBooking.CIC,
                    secondary: <FormattedMessage id="guest.booking.enterInformation.CIC" />,
                },
            ];
            setRoomDetails(roomDetailsData);
            setBookingDetails(bookingDetailsData);
            setBookingDetailsExtra(bookingDetailsExtraData);
            setPaymentDetails(paymentDetailsData);
            setUserDetails(userDetailsData);
        }
    }, [openDialogView, currentBooking, language]);

    return (
        <>
            {openDialogView && (
                <Dialog
                    fullWidth
                    maxWidth="md"
                    PaperProps={{
                        style: {
                            width: '90%',
                        },
                    }}
                    open={openDialogView}
                    onClose={handleToggleDialogView}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle
                        id="form-dialog-title"
                        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
                    >
                        <HeaderComponent
                            title={<FormattedMessage id="dashboardAdmin.bookings.title" />}
                            subtitle={<FormattedMessage id="dashboardAdmin.bookings.viewSubtitle" />}
                        />
                        <IconButton onClick={() => handleToggleDialogView()} size="large">
                            <Cancel fontSize="inherit" />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        <List disablePadding>
                            <ListItem sx={{ py: 1, px: 0 }}>
                                <Grid container spacing={2} xs={12} lg={12}>
                                    <Grid xs={12} lg={6}>
                                        <ListItemText
                                            primary={
                                                LANGUAGES.VI === language
                                                    ? currentBooking.bookingStatusData.valueVi
                                                    : currentBooking.bookingStatusData.valueEn
                                            }
                                            secondary={
                                                <FormattedMessage id="dashboardAdmin.bookings.details.bookingStatus" />
                                            }
                                        />
                                    </Grid>

                                    {currentBooking?.cancelTime && (
                                        <Grid xs={12} lg={6}>
                                            <ListItemText
                                                primary={dayjs(currentBooking.cancelTime).format('DD/MM/YYYY HH:mm:ss')}
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
                                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                    {language === LANGUAGES.VI
                                        ? formatCurrencyVND(currentBooking?.totalPrice)
                                        : formatCurrencyUSD(currentBooking?.totalPrice)}
                                </Typography>
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
                                    {currentBooking?.paymentData?.details && (
                                        <Grid xs={12} lg={6}>
                                            <div
                                                dangerouslySetInnerHTML={{
                                                    __html: currentBooking?.paymentData?.details,
                                                }}
                                            />
                                        </Grid>
                                    )}
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
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
};

DialogViewBooking.propTypes = {
    openDialogView: PropTypes.bool,
    handleToggleDialogView: PropTypes.func,
    currentBooking: PropTypes.object,
};
export default DialogViewBooking;
