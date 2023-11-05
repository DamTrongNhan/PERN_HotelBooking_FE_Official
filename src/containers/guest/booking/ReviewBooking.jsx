import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import {
    Typography,
    List,
    ListItem,
    ListItemText,
    Unstable_Grid2 as Grid,
    Divider,
    FormControl,
    InputLabel,
    Select,
    FormHelperText,
    MenuItem,
} from '@mui/material';

import { toast } from 'react-toastify';
import { FormattedMessage } from 'react-intl';

import LoadingOverlay from 'components/common/LoadingOverlay';

import { getAllCodesByTypeService } from 'services/allCodesService';

import dayjs from 'dayjs';

import { LANGUAGES, formatCurrencyVND, formatCurrencyUSD } from 'utils';

const ReviewBooking = props => {
    const { room, userData } = props;
    const { checkIn, checkOut, days, adult, child } = useSelector(state => state.bookingData);

    const language = useSelector(state => state.app.language || 'vi');
    const [allPaymentType, setAllPaymentType] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

    const getAllPaymentType = async () => {
        try {
            setIsLoading(true);
            const response = await getAllCodesByTypeService('PaymentType');
            if (response?.data) {
                setIsLoading(false);
                setAllPaymentType(response.data);
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error(error.message);
            }
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        getAllPaymentType();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <LoadingOverlay isLoading={isLoading} />
            <Typography variant="h6" gutterBottom>
                <FormattedMessage id="guest.booking.reviewBooking.title" />
            </Typography>

            <List disablePadding>
                <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemText
                        primary={
                            LANGUAGES.VI === language ? room.roomTypeDataRooms.valueVi : room.roomTypeDataRooms.valueEn
                        }
                        secondary={<FormattedMessage id="guest.booking.reviewBooking.roomType" />}
                    />
                </ListItem>
                <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemText
                        primary={
                            language === LANGUAGES.VI
                                ? formatCurrencyVND(room?.roomTypesDataRooms?.pricePerNight)
                                : formatCurrencyUSD(room?.roomTypesDataRooms?.pricePerNight)
                        }
                        secondary={<FormattedMessage id="guest.booking.reviewBooking.pricePerNight" />}
                    />
                </ListItem>

                <Divider />
                <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemText
                        primary={dayjs(checkIn).format('DD/MM/YYYY')}
                        secondary={<FormattedMessage id="guest.booking.reviewBooking.checkIn" />}
                    />
                    <ListItemText
                        primary={dayjs(checkOut).format('DD/MM/YYYY')}
                        secondary={<FormattedMessage id="guest.booking.reviewBooking.checkOut" />}
                    />
                </ListItem>

                <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemText
                        primary={room.number}
                        secondary={<FormattedMessage id="guest.booking.reviewBooking.roomNumber" />}
                    />
                    <ListItemText
                        primary={days}
                        secondary={<FormattedMessage id="guest.booking.reviewBooking.days" />}
                    />
                    <ListItemText
                        primary={adult}
                        secondary={<FormattedMessage id="guest.booking.reviewBooking.adult" />}
                    />
                    <ListItemText
                        primary={child}
                        secondary={<FormattedMessage id="guest.booking.reviewBooking.child" />}
                    />
                </ListItem>

                <Divider />
                <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemText primary="Total" />
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        {language === LANGUAGES.VI
                            ? formatCurrencyVND(room?.roomTypesDataRooms?.pricePerNight * days)
                            : formatCurrencyUSD(room?.roomTypesDataRooms?.pricePerNight * days)}
                    </Typography>
                </ListItem>
            </List>
            <Grid my={2} container>
                <FormControl fullWidth variant="standard">
                    <InputLabel id="select-payment-type">Payment type</InputLabel>
                    <Select
                        error={!!(props.formik.touched.paymentTypeKey && !!props.formik.errors.paymentTypeKey)}
                        labelId="select-payment-type"
                        name="paymentTypeKey"
                        label="Payment type"
                        onBlur={props.formik.handleBlur}
                        onChange={props.formik.handleChange}
                        value={props.formik.values.paymentTypeKey}
                    >
                        {allPaymentType &&
                            allPaymentType.map((paymentType, index) => {
                                return (
                                    <MenuItem key={index} value={paymentType.keyMap}>
                                        {language === LANGUAGES.VI ? paymentType.valueVi : paymentType.valueEn}
                                    </MenuItem>
                                );
                            })}
                    </Select>
                    <FormHelperText
                        error={!!(props.formik.touched.paymentTypeKey && !!props.formik.errors.paymentTypeKey)}
                    >
                        {props.formik.touched.paymentTypeKey && props.formik.errors.paymentTypeKey}
                    </FormHelperText>
                </FormControl>
            </Grid>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                <FormattedMessage id="guest.booking.reviewBooking.information" />
            </Typography>
            <List>
                <ListItem sx={{ py: 1, px: 0 }}>
                    <Grid
                        container
                        spacing={2}
                        xs={12}
                        lg={12}
                        alignItems="center"
                        sx={{ justifyContent: 'space-between' }}
                    >
                        <Grid xs={12} lg={6}>
                            <ListItemText
                                primary={`${userData.lastName} ${userData.firstName}`}
                                secondary={<FormattedMessage id="guest.booking.enterInformation.name" />}
                            />
                        </Grid>
                        <Grid xs={12} lg={6}>
                            <ListItemText
                                primary={userData.email}
                                secondary={<FormattedMessage id="guest.booking.enterInformation.email" />}
                            />
                        </Grid>
                    </Grid>
                </ListItem>
                <ListItem sx={{ py: 1, px: 0 }}>
                    <Grid container spacing={2} xs={12} lg={12} alignItems="center">
                        <Grid xs={12} lg={6}>
                            <ListItemText
                                primary={userData.phone}
                                secondary={<FormattedMessage id="guest.booking.enterInformation.phone" />}
                            />
                        </Grid>
                        <Grid xs={12} lg={6}>
                            <ListItemText
                                primary={userData.country}
                                secondary={<FormattedMessage id="guest.booking.enterInformation.country" />}
                            />
                        </Grid>
                    </Grid>
                </ListItem>
                <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemText
                        primary={userData.CIC}
                        secondary={<FormattedMessage id="guest.booking.enterInformation.CIC" />}
                    />
                </ListItem>
            </List>
        </>
    );
};

export default ReviewBooking;
