import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import {
    Unstable_Grid2 as Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Rating,
    Typography,
} from '@mui/material';

import { Input } from 'antd';

import { toast } from 'react-toastify';
import { FormattedMessage } from 'react-intl';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import useAxiosPrivate from 'hooks/useAxiosPrivate';
import { updateReviewService } from 'services/reviewsService';

import HeaderComponent from 'components/dashboard/HeaderComponent';

const DialogUpdateCode = props => {
    const { openDialogUpdate, handleToggleDialogUpdate, getAllReviews, currentReview = {}, setIsLoading } = props;

    const axiosPrivate = useAxiosPrivate();
    const { TextArea } = Input;

    const [star, setStar] = useState(5);

    useEffect(() => {
        if (openDialogUpdate) {
            const initialValues = {
                review: currentReview?.review || '',
            };
            setStar(currentReview?.star);
            formik.setValues(initialValues);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentReview, openDialogUpdate]);

    const formik = useFormik({
        initialValues: {
            review: '',
        },
        validationSchema: Yup.object({
            review: Yup.string().max(100, 'Maximum of 100 characters').required('Review is required'),
        }),
        enableReinitialize: true,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                setIsLoading(true);
                setSubmitting(true);

                handleToggleDialogUpdate();
                const response = await updateReviewService(axiosPrivate, currentReview?.id, { ...values, star });
                if (response) {
                    setIsLoading(false);
                    setSubmitting(false);

                    getAllReviews();
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
                            title={<FormattedMessage id="dashboardAdmin.reviews.title" />}
                            subtitle={<FormattedMessage id="dashboardAdmin.reviews.updateSubtitle" />}
                        />
                    </DialogTitle>
                    <DialogContent>
                        <form noValidate onSubmit={formik.handleSubmit}>
                            <Grid mt={1} container spacing={3}>
                                <Grid xs={12} lg={6}>
                                    <TextArea
                                        id="review"
                                        name="review"
                                        rows={4}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.review}
                                    />

                                    {formik.touched.review && formik.errors.review ? (
                                        <Typography color="error">{formik.errors.review}</Typography>
                                    ) : null}
                                </Grid>
                                <Grid xs={12} lg={6}>
                                    <Rating
                                        name="simple-controlled"
                                        value={star}
                                        onChange={(event, newValue) => {
                                            setStar(newValue);
                                        }}
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
    getAllReviews: PropTypes.func,
    currentReview: PropTypes.object,
};
export default DialogUpdateCode;
