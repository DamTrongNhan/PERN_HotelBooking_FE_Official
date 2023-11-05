import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { Box, Container, Paper, Stepper, Step, StepLabel, Button, Typography } from '@mui/material';

import { toast } from 'react-toastify';
import { FormattedMessage } from 'react-intl';

import * as Yup from 'yup';
import { useFormik } from 'formik';

import _ from 'lodash';

import LoadingOverlay from 'components/common/LoadingOverlay';

import { WithBookingIsAuthenticatedGuard } from 'hoc/WithBookingIsAuthenticatedGuard';

import useAxiosPrivate from 'hooks/useAxiosPrivate';
import { checkRoomAvailableService, getRoomService } from 'services/roomsService';
import { createBookingService } from 'services/bookingsService';
import { createBookingWithVnpayService } from 'services/bookingsVnpayService';
import { deleteBookingData } from 'store/slice/bookingDataSlice';

import CustomerDataForm from './CustomerDataForm';
import ReviewBooking from './ReviewBooking';

import { GUEST_PATHS, NOT_FOUND } from 'utils';

const steps = [
    <FormattedMessage id="guest.booking.enterInformation.label" />,
    <FormattedMessage id="guest.booking.reviewBooking.label" />,
];

const Booking = WithBookingIsAuthenticatedGuard(() => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const axiosPrivate = useAxiosPrivate();
    const ignore = useRef(false);

    const language = useSelector(state => state.app.language);

    const { checkIn, checkOut, days, adult, child } = useSelector(state => state.bookingData);
    const userId = useSelector(state => state.auth.userInfo?.id || '');
    const { roomId } = useParams();

    const [userData, setUserData] = useState({});
    const [room, setRoom] = useState({});
    const [bookingCode, setBookingCode] = useState('');

    const [activeStep, setActiveStep] = useState(0);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (ignore.current) {
                return;
            }
            ignore.current = true;

            if (
                !checkIn ||
                !checkOut ||
                !days ||
                !adult ||
                typeof days !== 'number' ||
                typeof adult !== 'number' ||
                days <= 0 ||
                adult <= 0
            ) {
                return navigate(NOT_FOUND);
            }
            await checkRoomAvailable();
            await getRoom();
        };
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [adult, checkIn, checkOut, days, roomId]);

    const checkRoomAvailable = async () => {
        try {
            setIsLoading(true);
            const response = await checkRoomAvailableService(axiosPrivate, roomId, checkIn, checkOut);
            if (response?.data) {
                setIsLoading(false);
                if (!response?.data?.isAvailable) {
                    navigate(NOT_FOUND);
                }
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error(error.message);
            }
            setIsLoading(false);
            navigate(NOT_FOUND);
        } finally {
            setIsLoading(false);
        }
    };

    const getRoom = async () => {
        try {
            setIsLoading(true);
            const response = await getRoomService(axiosPrivate, roomId);
            if (!_.isEmpty(response?.data?.data)) {
                setRoom(response.data.data);
                setIsLoading(false);
            } else {
                navigate(NOT_FOUND);
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error(error.message);
            }
            setIsLoading(false);
            navigate(NOT_FOUND);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNext = async () => {
        setActiveStep(activeStep + 1);
    };

    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };

    const getStepContent = step => {
        switch (step) {
            case 0:
                return <CustomerDataForm formik={formikCustomerDataForm} />;
            case 1:
                return <ReviewBooking formik={formikPaymentForm} room={room} userData={userData} />;
            default:
                throw new Error('Unknown step');
        }
    };

    const customerDataFormValidationSchema = Yup.object().shape({
        firstName: Yup.string().max(32, 'Maximum of 32 characters').required('First name is required'),
        lastName: Yup.string().max(32, 'Maximum of 32 characters').required('Last name is required'),
        email: Yup.string().email('Email is invalid').required('Email is required'),
        phone: Yup.string()
            .matches(/((09|03|07|08|05)+([0-9]{8})\b)/g, 'Phone is invalid')
            .required('Phone is required'),
        CIC: Yup.string().max(32, 'Maximum of 32 characters').required('Citizen ID is required'),
        country: Yup.string().max(32, 'Maximum of 32 characters').required('Country is required'),
    });

    const paymentFormValidationSchema = Yup.object().shape({
        paymentTypeKey: Yup.string().max(32, 'Maximum of 32 characters').required('Payment type is required'),
    });

    const formikCustomerDataForm = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            CIC: '',
            country: '',
        },
        validationSchema: customerDataFormValidationSchema,
        onSubmit: values => {
            setUserData(values);
            handleNext();
        },
    });
    const formikPaymentForm = useFormik({
        initialValues: {
            paymentTypeKey: '',
        },
        validationSchema: paymentFormValidationSchema,
        onSubmit: values => {
            handleFormSubmit();
        },
    });

    const handleSubmit = () => {
        switch (activeStep) {
            case 0:
                formikCustomerDataForm.handleSubmit();
                break;
            case 1:
                formikPaymentForm.handleSubmit();
                break;
            default:
                throw new Error('Unknown step');
        }
    };
    const handleFormSubmit = async () => {
        var data = {
            firstName: formikCustomerDataForm.values.firstName,
            lastName: formikCustomerDataForm.values.lastName,
            email: formikCustomerDataForm.values.email.toLowerCase(),
            phone: formikCustomerDataForm.values.phone,
            country: formikCustomerDataForm.values.country,
            CIC: formikCustomerDataForm.values.CIC,
            paymentTypeKey: formikPaymentForm.values.paymentTypeKey,
            language,
            roomId,
            userId,
            checkIn,
            checkOut,
            days,
            adult,
            child,
        };
        data.totalPrice = room.roomTypesDataRooms.pricePerNight * days;

        try {
            setIsLoading(true);
            let response;
            if (data.paymentTypeKey === 'P2') {
                response = await createBookingWithVnpayService(axiosPrivate, data);
                if (response?.data) {
                    dispatch(deleteBookingData());
                    setIsLoading(false);
                    window.open(response?.data.paymentUrl, '_self');
                }
            } else if (data.paymentTypeKey === 'P1') {
                response = await createBookingService(axiosPrivate, data);
                if (response?.data) {
                    toast.success(response?.data?.message);
                    setBookingCode(response?.data?.bookingCode);
                    dispatch(deleteBookingData());
                    setIsLoading(false);
                    handleNext();
                }
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

    return (
        <>
            <Box sx={{ flex: '1 1 auto' }}>
                <LoadingOverlay isLoading={isLoading} />

                <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
                    <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                        <Typography component="h1" variant="h4" align="center">
                            <FormattedMessage id="guest.booking.booking" />
                        </Typography>
                        <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
                            {steps &&
                                steps.map((label, index) => (
                                    <Step key={index}>
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                ))}
                        </Stepper>
                        {activeStep === steps.length ? (
                            <>
                                <Typography align="center" variant="h5" gutterBottom>
                                    <FormattedMessage id="guest.booking.thankYou" />
                                </Typography>
                                <Typography align="center" variant="subtitle1" gutterBottom>
                                    <FormattedMessage id="guest.booking.bookingCode" />
                                    {bookingCode}
                                    <FormattedMessage id="guest.booking.confirmBooking" />
                                </Typography>
                                <Box mt={2} display="flex" justifyContent="center">
                                    <Button
                                        onClick={() => navigate(GUEST_PATHS.GUEST)}
                                        variant="contained"
                                        color="primary"
                                    >
                                        <FormattedMessage id="guest.booking.homePage" />
                                    </Button>
                                </Box>
                            </>
                        ) : (
                            <>
                                <form noValidate autoComplete="off">
                                    {getStepContent(activeStep)}
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        {activeStep !== 0 && (
                                            <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                                                Back
                                            </Button>
                                        )}

                                        <Button onClick={handleSubmit} sx={{ mt: 3, ml: 1 }} variant="contained">
                                            {activeStep === steps.length - 1 ? 'Book' : 'Next'}
                                        </Button>
                                    </Box>
                                </form>
                            </>
                        )}
                    </Paper>
                </Container>
            </Box>
        </>
    );
});

export default Booking;
