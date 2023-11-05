import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Button, TextField, Unstable_Grid2 as Grid, Paper, Box } from '@mui/material';

import { toast } from 'react-toastify';
import { FormattedMessage } from 'react-intl';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import LoadingOverlay from 'components/common/LoadingOverlay';

import { forgotPasswordService } from 'services/authServices';

import { AUTH_PATHS } from 'utils';

const ForgotPassword = () => {
    const language = useSelector(state => state.app.language);

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email').required('Email is required'),
        }),
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                setIsLoading(true);
                setSubmitting(true);

                const response = await forgotPasswordService({ language, ...values });
                if (response) {
                    setIsLoading(false);
                    setSubmitting(false);

                    toast.success(response.message);
                    resetForm();
                    navigate(AUTH_PATHS.VERIFY_OTP);
                } else {
                    setIsLoading(false);
                    setSubmitting(false);
                }
            } catch (error) {
                setIsLoading(false);
                setSubmitting(false);

                if (error.response && error.response.data && error.response.data.message) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error(error.message);
                }
                resetForm();
            } finally {
                setIsLoading(false);
                setSubmitting(false);
            }
        },
    });
    return (
        <>
            <LoadingOverlay isLoading={isLoading} />

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: '1 1 auto',
                }}
            >
                <Box
                    sx={{
                        maxWidth: 550,
                        px: 3,
                        py: '100px',
                        width: '100%',
                    }}
                >
                    <Paper elevation={7} sx={{ p: { xs: 2, md: 3 } }}>
                        <form noValidate onSubmit={formik.handleSubmit}>
                            <Grid xs={12} lg={12} spacing={3} container sx={{ justifyContent: 'center' }}>
                                <Grid xs={12} lg={12}>
                                    <TextField
                                        fullWidth
                                        error={!!(formik.touched.email && !!formik.errors.email)}
                                        helperText={formik.touched.email && formik.errors.email}
                                        variant="outlined"
                                        label="Email"
                                        name="email"
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        type="text"
                                        value={formik.values.email}
                                    />
                                </Grid>

                                <Grid xs={12} lg={12}>
                                    <Button type="submit" color="secondary" variant="contained">
                                        <FormattedMessage id="auth.send" />
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Paper>
                </Box>
            </Box>
        </>
    );
};

export default ForgotPassword;
