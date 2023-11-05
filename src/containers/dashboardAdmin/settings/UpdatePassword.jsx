import { useState } from 'react';
import { useSelector } from 'react-redux';

import {
    Button,
    FormControl,
    FormHelperText,
    OutlinedInput,
    InputLabel,
    IconButton,
    InputAdornment,
    Unstable_Grid2 as Grid,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import { toast } from 'react-toastify';
import { FormattedMessage } from 'react-intl';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import LoadingOverlay from 'components/common/LoadingOverlay';

import useAxiosPrivate from 'hooks/useAxiosPrivate';
import { updatePasswordService } from 'services/usersService';

const UpdatePassword = () => {
    const axiosPrivate = useAxiosPrivate();

    const id = useSelector(state => state.auth.userInfo?.id || '');

    const [isLoading, setIsLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(show => !show);

    const formik = useFormik({
        initialValues: {
            oldPassword: '',
            newPassword: '',
            confirmNewPassword: '',
        },
        validationSchema: Yup.object({
            oldPassword: Yup.string()
                .min(8, 'Minimum of 8 characters')
                .max(32, 'Maximum of 32 characters')
                .required('Old password is required'),
            newPassword: Yup.string()
                .min(8, 'Minimum of 8 characters')
                .max(32, 'Maximum of 32 characters')
                .required('New password is required'),
            confirmNewPassword: Yup.string()
                .oneOf([Yup.ref('newPassword')], 'Password does not match!')
                .required('Confirm new password is required.'),
        }),
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                setIsLoading(true);
                setSubmitting(true);

                const response = await updatePasswordService(axiosPrivate, id, values);
                if (response) {
                    setIsLoading(false);
                    setSubmitting(false);

                    toast.success(response.data.message);
                    resetForm();
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

            <form noValidate onSubmit={formik.handleSubmit}>
                <Grid xs={12} lg={12} container spacing={2}>
                    <Grid xs={12} lg={6}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel color="primary" htmlFor="outlined-oldPassword">
                                Old password
                            </InputLabel>
                            <OutlinedInput
                                id="outlined-oldPassword"
                                error={!!(formik.touched.oldPassword && formik.errors.oldPassword)}
                                fullWidth
                                label="Old password"
                                name="oldPassword"
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
                                value={formik.values.oldPassword}
                            />
                            <FormHelperText sx={{ color: 'red' }} id="outlined-password-helper-text">
                                {formik.touched.oldPassword && formik.errors.oldPassword}
                            </FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid xs={12} lg={6}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel color="primary" htmlFor="outlined-newPassword">
                                New password
                            </InputLabel>
                            <OutlinedInput
                                id="outlined-newPassword"
                                error={!!(formik.touched.newPassword && formik.errors.newPassword)}
                                fullWidth
                                label="New password"
                                name="newPassword"
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
                                value={formik.values.newPassword}
                            />
                            <FormHelperText sx={{ color: 'red' }} id="outlined-password-helper-text">
                                {formik.touched.newPassword && formik.errors.newPassword}
                            </FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid xs={12} lg={6}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel htmlFor="outlined-confirm-new-password">Confirm new password</InputLabel>
                            <OutlinedInput
                                id="outlined-confirm-new-password"
                                error={!!(formik.touched.confirmNewPassword && formik.errors.confirmNewPassword)}
                                fullWidth
                                label="Confirm new password"
                                name="confirmNewPassword"
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
                                aria-describedby="outlined-confirm-new-password-helper-text"
                                value={formik.values.confirmNewPassword}
                            />
                            <FormHelperText sx={{ color: 'red' }} id="outlined-confirm-new-password-helper-text">
                                {formik.touched.confirmNewPassword && formik.errors.confirmNewPassword}
                            </FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid xs={12} lg={12}>
                        <Button type="submit" color="secondary" variant="contained">
                            <FormattedMessage id="dashboardCommon.update" />
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </>
    );
};

export default UpdatePassword;
