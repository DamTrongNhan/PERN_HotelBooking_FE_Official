import { useEffect } from 'react';
import PropTypes from 'prop-types';

import {
    Unstable_Grid2 as Grid,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from '@mui/material';

import { toast } from 'react-toastify';
import { FormattedMessage } from 'react-intl';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import useAxiosPrivate from 'hooks/useAxiosPrivate';
import { updateCodeService } from 'services/allCodesService';

import HeaderComponent from 'components/dashboard/HeaderComponent';

const DialogUpdateCode = props => {
    const { openDialogUpdate, handleToggleDialogUpdate, getAllCodes, currentCode = {}, setIsLoading } = props;

    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        if (openDialogUpdate) {
            const initialValues = {
                keyMap: currentCode?.keyMap || '',
                type: currentCode?.type || '',
                valueVi: currentCode?.valueVi || '',
                valueEn: currentCode?.valueEn || '',
            };

            formik.setValues(initialValues);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentCode, openDialogUpdate]);

    const formik = useFormik({
        initialValues: {
            keyMap: '',
            type: '',
            valueVi: '',
            valueEn: '',
        },
        validationSchema: Yup.object({
            keyMap: Yup.string().max(10).required('Key Map is required'),
            type: Yup.string().required('Type is required'),
            valueVi: Yup.string().required('Value Vi is required'),
            valueEn: Yup.string().required('Value En is required'),
        }),
        enableReinitialize: true,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                setIsLoading(true);
                setSubmitting(true);

                handleToggleDialogUpdate();
                const response = await updateCodeService(axiosPrivate, currentCode.id, values);
                if (response) {
                    setIsLoading(false);
                    setSubmitting(false);

                    getAllCodes();
                    toast.success(response.data.message);
                    resetForm();
                }
            } catch (error) {
                setIsLoading(false);
                setSubmitting(false);

                if (error.response && error.response.data && error.response.data.message) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error(error.message);
                }
            } finally {
                setIsLoading(false);
                setSubmitting(false);
            }
        },
    });
    return (
        <>
            {openDialogUpdate && (
                <Dialog
                    open={openDialogUpdate}
                    onClose={handleToggleDialogUpdate}
                    fullWidth
                    maxWidth="lg"
                    PaperProps={{
                        style: {
                            width: '80%',
                        },
                    }}
                    aria-labelledby="form-dialog-update"
                >
                    <DialogTitle id="form-dialog-update">
                        <HeaderComponent
                            title={<FormattedMessage id="dashboardAdmin.allCodes.title" />}
                            subtitle={<FormattedMessage id="dashboardAdmin.allCodes.updateSubtitle" />}
                        />
                    </DialogTitle>
                    <DialogContent>
                        <form noValidate onSubmit={formik.handleSubmit}>
                            <Grid mt={1} container spacing={3}>
                                <Grid xs={12} lg={6}>
                                    <TextField
                                        error={!!(formik.touched.keyMap && !!formik.errors.keyMap)}
                                        fullWidth
                                        helperText={formik.touched.keyMap && formik.errors.keyMap}
                                        variant="filled"
                                        label="Key Map"
                                        name="keyMap"
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        type="text"
                                        value={formik.values.keyMap}
                                    />
                                </Grid>
                                <Grid xs={12} lg={6}>
                                    <TextField
                                        error={!!(formik.touched.type && !!formik.errors.type)}
                                        fullWidth
                                        helperText={formik.touched.type && formik.errors.type}
                                        variant="filled"
                                        label="Type"
                                        name="type"
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        type="text"
                                        value={formik.values.type}
                                    />
                                </Grid>
                                <Grid xs={12} lg={6}>
                                    <TextField
                                        error={!!(formik.touched.valueVi && !!formik.errors.valueVi)}
                                        fullWidth
                                        helperText={formik.touched.valueVi && formik.errors.valueVi}
                                        variant="filled"
                                        label="Value Vi"
                                        name="valueVi"
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        type="text"
                                        value={formik.values.valueVi}
                                    />
                                </Grid>
                                <Grid xs={12} lg={6}>
                                    <TextField
                                        error={!!(formik.touched.valueEn && !!formik.errors.valueEn)}
                                        fullWidth
                                        helperText={formik.touched.valueEn && formik.errors.valueEn}
                                        variant="filled"
                                        label="Value En"
                                        name="valueEn"
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        type="text"
                                        value={formik.values.valueEn}
                                    />
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

DialogUpdateCode.propTypes = {
    openDialogUpdate: PropTypes.bool,
    handleToggleDialogUpdate: PropTypes.func,
    getAllCodes: PropTypes.func,
    currentCode: PropTypes.object,
};
export default DialogUpdateCode;
