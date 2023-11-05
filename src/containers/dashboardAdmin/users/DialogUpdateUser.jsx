import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import {
    Box,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    styled,
    Avatar,
    Unstable_Grid2 as Grid,
    FormHelperText,
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import HeaderComponent from 'components/dashboard/HeaderComponent';
import LoadingOverlay from 'components/common/LoadingOverlay';

import { toast } from 'react-toastify';
import { FormattedMessage } from 'react-intl';
import dayjs from 'dayjs';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import useAxiosPrivate from 'hooks/useAxiosPrivate';
import { updateUserService } from 'services/usersService';
import { getAllCodesByTypeService } from 'services/allCodesService';

import { LANGUAGES, getBase64 } from 'utils';

const DialogUpdateUser = props => {
    const { openDialogUpdate, handleToggleDialogUpdate, getAllUsers, currentUser = {}, setIsLoading } = props;

    const axiosPrivate = useAxiosPrivate();
    const language = useSelector(state => state.app.language || 'vi');

    const [allGenders, setAllGenders] = useState([]);
    const [loadingGenders, setLoadingGenders] = useState(false);

    const [avatar, setAvatar] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    const [birthday, setBirthday] = useState(dayjs());

    const handleChangeAvatar = event => {
        const file = event.target.files[0];
        setAvatar(file);
        getBase64(file).then(data => {
            setPreviewImage(data);
        });
    };

    const handleChangeBirthday = date => {
        setBirthday(date);
    };

    const getAllGenders = async () => {
        try {
            setLoadingGenders(true);
            const response = await getAllCodesByTypeService('Gender');
            if (response?.data) {
                setLoadingGenders(false);
                setAllGenders(response.data);
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error(error.message);
            }
            setLoadingGenders(false);
        } finally {
            setLoadingGenders(false);
        }
    };

    useEffect(() => {
        if (openDialogUpdate) {
            const initialValues = {
                phone: currentUser?.phone || '',
                firstName: currentUser?.firstName || '',
                lastName: currentUser?.lastName || '',
                genderKey: currentUser?.genderKey || '',
                CIC: currentUser?.CIC || '',
                country: currentUser?.country || '',
            };
            formik.setValues(initialValues);
            getAllGenders();

            setBirthday(dayjs(currentUser?.birthday) || dayjs());
            setPreviewImage(currentUser?.avatarData?.url || null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser, openDialogUpdate]);

    const formik = useFormik({
        initialValues: {
            phone: '',
            firstName: '',
            lastName: '',
            genderKey: '',
            CIC: '',
            country: '',
        },
        validationSchema: Yup.object({
            phone: Yup.string()
                .matches(/((09|03|07|08|05)+([0-9]{8})\b)/g, 'Phone is invalid')
                .required('Phone is required'),
            firstName: Yup.string().max(32, 'Maximum of 32 characters'),
            lastName: Yup.string().max(32, 'Maximum of 32 characters'),
            genderKey: Yup.string().max(32, 'Maximum of 32 characters').required('Gender is required'),
            CIC: Yup.string().max(32, 'Maximum of 32 characters'),
            country: Yup.string().max(32, 'Maximum of 32 characters'),
        }),
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                setIsLoading(true);
                setSubmitting(true);

                handleToggleDialogUpdate();

                let formData = new FormData();
                formData.append('data', JSON.stringify({ ...values, birthday }));

                if (avatar) {
                    formData.append('file', avatar);
                }

                const response = await updateUserService(axiosPrivate, currentUser.id, formData);
                if (response) {
                    setIsLoading(false);
                    setSubmitting(false);

                    setBirthday(dayjs());

                    setAvatar(null);
                    setPreviewImage(null);

                    getAllUsers();
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
    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });
    return (
        <>
            {openDialogUpdate && (
                <Dialog
                    fullWidth
                    maxWidth="xl"
                    PaperProps={{
                        style: {
                            width: '90%',
                        },
                    }}
                    open={openDialogUpdate}
                    onClose={handleToggleDialogUpdate}
                    aria-labelledby="form-dialog-title"
                >
                    <LoadingOverlay isLoading={loadingGenders} />
                    <DialogTitle id="form-dialog-title">
                        <HeaderComponent
                            title={<FormattedMessage id="dashboardAdmin.users.title" />}
                            subtitle={<FormattedMessage id="dashboardAdmin.users.updateSubtitle" />}
                        />
                    </DialogTitle>
                    <DialogContent>
                        <form noValidate onSubmit={formik.handleSubmit}>
                            <Grid mt={1} container spacing={3}>
                                <Grid xs={12} lg={6}>
                                    <TextField
                                        fullWidth
                                        error={!!(formik.touched.firstName && !!formik.errors.firstName)}
                                        helperText={formik.touched.firstName && formik.errors.firstName}
                                        variant="outlined"
                                        label="First Name"
                                        name="firstName"
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        type="text"
                                        value={formik.values.firstName}
                                    />
                                </Grid>

                                <Grid xs={12} lg={6}>
                                    <TextField
                                        error={!!(formik.touched.lastName && !!formik.errors.lastName)}
                                        fullWidth
                                        helperText={formik.touched.lastName && formik.errors.lastName}
                                        variant="outlined"
                                        label="Last Name"
                                        name="lastName"
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        type="text"
                                        value={formik.values.lastName}
                                    />
                                </Grid>

                                <Grid xs={12} lg={6}>
                                    <TextField
                                        error={!!(formik.touched.phone && !!formik.errors.phone)}
                                        fullWidth
                                        helperText={formik.touched.phone && formik.errors.phone}
                                        variant="outlined"
                                        label="Phone"
                                        name="phone"
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        type="text"
                                        value={formik.values.phone}
                                    />
                                </Grid>

                                <Grid xs={12} lg={6}>
                                    <TextField
                                        error={!!(formik.touched.country && !!formik.errors.country)}
                                        fullWidth
                                        helperText={formik.touched.country && formik.errors.country}
                                        variant="outlined"
                                        label="Country"
                                        name="country"
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        type="text"
                                        value={formik.values.country}
                                    />
                                </Grid>

                                <Grid xs={12} lg={6}>
                                    <TextField
                                        error={!!(formik.touched.CIC && !!formik.errors.CIC)}
                                        fullWidth
                                        helperText={formik.touched.CIC && formik.errors.CIC}
                                        variant="outlined"
                                        label="CIC"
                                        name="CIC"
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        type="text"
                                        value={formik.values.CIC}
                                    />
                                </Grid>
                                <Grid xs={12} lg={6}>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel id="select-gender">Gender</InputLabel>
                                        <Select
                                            error={!!(formik.touched.genderKey && !!formik.errors.genderKey)}
                                            labelId="select-gender"
                                            name="genderKey"
                                            label="Gender"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            value={formik.values.genderKey}
                                        >
                                            {allGenders &&
                                                allGenders.map((gender, index) => {
                                                    return (
                                                        <MenuItem key={index} value={gender.keyMap}>
                                                            {language === LANGUAGES.VI
                                                                ? gender.valueVi
                                                                : gender.valueEn}
                                                        </MenuItem>
                                                    );
                                                })}
                                        </Select>
                                        <FormHelperText
                                            error={!!(formik.touched.genderKey && !!formik.errors.genderKey)}
                                        >
                                            {formik.touched.genderKey && formik.errors.genderKey}
                                        </FormHelperText>
                                    </FormControl>
                                </Grid>

                                <Grid xs={12} lg={6}>
                                    <DatePicker
                                        label={'Birthday'}
                                        maxDate={dayjs()}
                                        value={birthday}
                                        onChange={handleChangeBirthday}
                                    />
                                </Grid>

                                <Grid container xs={12} lg={12} sx={{ alignItems: 'center' }}>
                                    <Grid>
                                        <Button
                                            onChange={handleChangeAvatar}
                                            component="label"
                                            variant="outlined"
                                            color="info"
                                            startIcon={<CloudUpload />}
                                        >
                                            Upload avatar
                                            <VisuallyHiddenInput type="file" />
                                        </Button>
                                    </Grid>

                                    <Grid>
                                        <Avatar
                                            alt="Avatar"
                                            src={previewImage ? previewImage : ''}
                                            sx={{ width: 150, height: 150 }}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <DialogActions>
                                <Button onClick={() => handleToggleDialogUpdate()} color="text" variant="contained">
                                    <FormattedMessage id="dashboardCommon.cancel" />
                                </Button>
                                <Button type="submit" color="secondary" variant="contained">
                                    <FormattedMessage id="dashboardCommon.update" />
                                </Button>
                            </DialogActions>
                        </form>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
};

DialogUpdateUser.propTypes = {
    openDialogUpdate: PropTypes.bool,
    handleToggleDialogUpdate: PropTypes.func,
    getAllUsers: PropTypes.func,
    currentUser: PropTypes.object,
};
export default DialogUpdateUser;
