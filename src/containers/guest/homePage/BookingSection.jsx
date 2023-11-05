import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
    Box,
    OutlinedInput,
    InputAdornment,
    IconButton,
    FormControl,
    Unstable_Grid2 as Grid,
    useTheme,
    Button,
    InputLabel,
    FormHelperText,
} from '@mui/material';
import { ChildCare, PersonOutline } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import * as Yup from 'yup';
import { useFormik } from 'formik';

import { FormattedMessage } from 'react-intl';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

import { GUEST_PATHS } from 'utils';
import { updateBookingData } from 'store/slice/bookingDataSlice';

const BookingSection = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [checkIn, setCheckIn] = useState(dayjs());
    const [checkOut, setCheckOut] = useState(dayjs().add(1, 'day'));

    const theme = useTheme();
    const neutralLight = theme.palette.neutral.light;
    const alt = theme.palette.background.alt;

    const formik = useFormik({
        initialValues: {
            adult: 1,
            child: 0,
        },
        validationSchema: Yup.object({
            adult: Yup.number().min(1, 'Minimum is 1').required('Adult is required'),
            child: Yup.number().min(0, 'Minimum is 0').required('Child is required'),
        }),
        onSubmit: (values, { resetForm }) => {
            const checkInDate = dayjs(checkIn).toDate();
            const checkOutDate = dayjs(checkOut).toDate();
            const days = dayjs(checkOut).diff(dayjs(checkIn), 'day');

            if (checkInDate.setHours(0, 0, 0, 0) >= checkOutDate.setHours(0, 0, 0, 0)) {
                toast.error('Check in is bigger than check out');
                return;
            } else {
                dispatch(
                    updateBookingData({
                        checkIn,
                        checkOut,
                        days,
                        ...values,
                    })
                );
                navigate(GUEST_PATHS.ROOM_TYPES_LIST);
            }
        },
    });

    return (
        <>
            <Box
                backgroundColor={neutralLight}
                sx={{
                    flex: '1 1 auto',
                    padding: '50px 50px',
                }}
            >
                <form noValidate onSubmit={formik.handleSubmit}>
                    <Grid
                        container
                        backgroundColor={alt}
                        spacing={2}
                        sx={{
                            justifyContent: 'center',
                            padding: '50px 50px',
                            borderRadius: '10px',
                            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
                        }}
                    >
                        <Grid xs={12} lg={2}>
                            <DatePicker
                                sx={{ width: '100%' }}
                                label={'Check in'}
                                minDate={dayjs()}
                                // maxDate={dayjs(checkOut).subtract(1, 'day')}
                                value={checkIn}
                                onChange={date => setCheckIn(date)}
                                format="DD-MM-YYYY"
                            />
                        </Grid>
                        <Grid xs={12} lg={2}>
                            <DatePicker
                                sx={{ width: '100%' }}
                                label={'Check out'}
                                minDate={checkIn.add(1, 'day')}
                                value={checkOut}
                                onChange={date => setCheckOut(date)}
                                format="DD-MM-YYYY"
                            />
                        </Grid>
                        <Grid xs={12} lg={2}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel htmlFor="outlined-adornment-adult">Adult</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-adult"
                                    error={!!(formik.touched.adult && !!formik.errors.adult)}
                                    name="adult"
                                    label="adult"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.adult}
                                    type="number"
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton edge="end">
                                                <PersonOutline />
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    inputProps={{
                                        min: 1,
                                        max: 5,
                                    }}
                                />
                                <FormHelperText error={!!(formik.touched.adult && !!formik.errors.adult)}>
                                    {formik.touched.adult && formik.errors.adult}
                                </FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid xs={12} lg={2}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel htmlFor="outlined-adornment-child">Child</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-child"
                                    error={!!(formik.touched.child && !!formik.errors.child)}
                                    name="child"
                                    label="child"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.child}
                                    type="number"
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton edge="end">
                                                <ChildCare />
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    inputProps={{
                                        min: 0,
                                        max: 5,
                                    }}
                                />
                            </FormControl>
                            <FormHelperText error={!!(formik.touched.child && !!formik.errors.child)}>
                                {formik.touched.child && formik.errors.child}
                            </FormHelperText>
                        </Grid>

                        <Grid xs={12} lg={2}>
                            <Button fullWidth type="submit" variant="contained" color="primary" sx={{ height: '100%' }}>
                                <FormattedMessage id="guest.homePage.search" />
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </>
    );
};

export default BookingSection;
