import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
    Box,
    Stack,
    TextField,
    Button,
    Typography,
    InputAdornment,
    IconButton,
    OutlinedInput,
    FormHelperText,
    InputLabel,
    FormControl,
    Link,
} from '@mui/material';
import { Google, Visibility, VisibilityOff } from '@mui/icons-material';

import { FormattedMessage } from 'react-intl';
import { toast } from 'react-toastify';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import LoadingOverlay from 'components/common/LoadingOverlay';

import { signUp } from 'store/slice/authSlice';

import { AUTH_PATHS } from 'utils';

import { getGoogleUrl } from 'utils';

const SignUp = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(show => !show);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
            password: Yup.string()
                .min(8, 'Password must be least 8 character.')
                .max(255)
                .required('Password is required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password')], 'Password does not match!')
                .required('Confirm password is required.'),
        }),
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                setIsLoading(true);
                setSubmitting(true);

                const response = await dispatch(signUp({ values, navigate })).unwrap();

                setIsLoading(false);
                setSubmitting(false);

                toast.success(response.message);
                resetForm();
            } catch (error) {
                setIsLoading(false);
                setSubmitting(false);

                if (error.response && error.response.data && error.response.data.message) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error('Có lỗi xảy ra trong quá trình đăng ký.');
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
                    <div>
                        <Stack spacing={1} sx={{ mb: 3 }}>
                            <Typography variant="h4">
                                <FormattedMessage id="auth.signUp" />
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography sx={{ opacity: '0.8' }}>Don&apos;t have an account? &nbsp;</Typography>
                                <Typography
                                    onClick={() => navigate(AUTH_PATHS.SIGN_IN)}
                                    variant="h5"
                                    color="secondary"
                                    sx={{ display: 'inline', cursor: 'pointer' }}
                                >
                                    <FormattedMessage id="auth.signIn" />
                                </Typography>
                            </Box>
                        </Stack>
                        <form noValidate onSubmit={formik.handleSubmit}>
                            <Stack spacing={3}>
                                <TextField
                                    error={!!(formik.touched.email && formik.errors.email)}
                                    fullWidth
                                    helperText={formik.touched.email && formik.errors.email}
                                    label="Email Address"
                                    name="email"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    type="email"
                                    value={formik.values.email}
                                />
                                <FormControl variant="outlined">
                                    <InputLabel color="primary" htmlFor="outlined-password">
                                        Password
                                    </InputLabel>
                                    <OutlinedInput
                                        id="outlined-password"
                                        error={!!(formik.touched.password && formik.errors.password)}
                                        fullWidth
                                        label="Password"
                                        name="password"
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        type={showPassword ? 'text' : 'password'}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        aria-describedby="outlined-password-helper-text"
                                        value={formik.values.password}
                                    />
                                    <FormHelperText sx={{ color: 'red' }} id="outlined-password-helper-text">
                                        {formik.touched.password && formik.errors.password}
                                    </FormHelperText>
                                </FormControl>
                                <FormControl variant="outlined">
                                    <InputLabel htmlFor="outlined-confirm-password">Confirm Password</InputLabel>
                                    <OutlinedInput
                                        id="outlined-confirm-password"
                                        error={!!(formik.touched.confirmPassword && formik.errors.confirmPassword)}
                                        fullWidth
                                        label="Confirm Password"
                                        name="confirmPassword"
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        type={showPassword ? 'text' : 'password'}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        aria-describedby="outlined-confirm-password-helper-text"
                                        value={formik.values.confirmPassword}
                                    />
                                    <FormHelperText sx={{ color: 'red' }} id="outlined-confirm-password-helper-text">
                                        {formik.touched.confirmPassword && formik.errors.confirmPassword}
                                    </FormHelperText>
                                </FormControl>
                            </Stack>
                            <Button
                                fullWidth
                                size="large"
                                sx={{ mt: 3 }}
                                type="submit"
                                variant="contained"
                                color="info"
                            >
                                <FormattedMessage id="auth.continue" />
                            </Button>
                            {/* <Link href={getGoogleUrl()}>
                                <Button
                                    fullWidth
                                    size="large"
                                    sx={{ mt: 3 }}
                                    variant="contained"
                                    color="error"
                                    endIcon={<Google />}
                                >
                                    <FormattedMessage id="auth.google" />
                                </Button>
                            </Link> */}
                        </form>
                    </div>
                </Box>
            </Box>
        </>
    );
};

export default SignUp;
