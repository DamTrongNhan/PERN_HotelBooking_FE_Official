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

import HeaderComponent from 'components/dashboard/HeaderComponent';

import useAxiosPrivate from 'hooks/useAxiosPrivate';
import { createCodeService } from 'services/allCodesService';

const ModalCreateCode = props => {
    const { openDialogCreate, handleToggleDialogCreate, getAllCodes, setIsLoading } = props;

    const axiosPrivate = useAxiosPrivate();

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
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                setIsLoading(true);
                setSubmitting(true);

                handleToggleDialogCreate();
                const response = await createCodeService(axiosPrivate, values);
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
                resetForm();
            } finally {
                setIsLoading(false);
                setSubmitting(false);
            }
        },
    });
    return (
        <>
            {openDialogCreate && (
                <Dialog
                    fullWidth
                    maxWidth="lg"
                    PaperProps={{
                        style: {
                            width: '80%',
                        },
                    }}
                    open={openDialogCreate}
                    onClose={handleToggleDialogCreate}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">
                        <HeaderComponent
                            title={<FormattedMessage id="dashboardAdmin.allCodes.title" />}
                            subtitle={<FormattedMessage id="dashboardAdmin.allCodes.createSubtitle" />}
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
                            </Grid>

                            <DialogActions>
                                <Button onClick={() => handleToggleDialogCreate()} color="text" variant="contained">
                                    <FormattedMessage id="dashboardCommon.cancel" />
                                </Button>
                                <Button type="submit" color="secondary" variant="contained">
                                    <FormattedMessage id="dashboardCommon.create" />
                                </Button>
                            </DialogActions>
                        </form>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
};

ModalCreateCode.propTypes = {
    openDialogCreate: PropTypes.bool,
    handleToggleDialogCreate: PropTypes.func,
    getAllCodes: PropTypes.func,
};
export default ModalCreateCode;
