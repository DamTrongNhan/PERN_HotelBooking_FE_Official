import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import {
    TextField,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    InputAdornment,
    Unstable_Grid2 as Grid,
    styled,
    Typography,
    Badge,
} from '@mui/material';

import { Cancel, CloudUpload } from '@mui/icons-material';

import { toast } from 'react-toastify';
import { FormattedMessage } from 'react-intl';

import { Image } from 'antd';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import HeaderComponent from 'components/dashboard/HeaderComponent';

import useAxiosPrivate from 'hooks/useAxiosPrivate';
import { updateService_Service } from 'services/services_Service';

import { getBase64 } from 'utils';

const DialogUpdateService = props => {
    const { openDialogUpdate, handleToggleDialogUpdate, getAllServices, currentService = {}, setIsLoading } = props;

    const axiosPrivate = useAxiosPrivate();

    const [thumbnail, setThumbnail] = useState(null);
    const [previewThumbnail, setPreviewThumbnail] = useState(null);

    const [descriptionVi, setDescriptionVi] = useState('');
    const [descriptionEn, setDescriptionEn] = useState('');

    const handleChangeThumbnail = event => {
        const file = event.target.files[0];
        setThumbnail(file);
        getBase64(file).then(data => {
            setPreviewThumbnail(data);
        });
    };
    const handleRemove = () => {
        setThumbnail(null);
        setPreviewThumbnail(null);
    };
    const handleChangeDescriptionVi = (event, editor) => {
        const data = editor.getData();
        setDescriptionVi(data);
    };

    const handleChangeDescriptionEn = (event, editor) => {
        const data = editor.getData();
        setDescriptionEn(data);
    };

    useEffect(() => {
        if (openDialogUpdate) {
            const initialValues = {
                keyMap: currentService?.keyMap || '',
                type: currentService?.type || '',
                titleVi: currentService?.titleVi || '',
                titleEn: currentService?.titleEn || '',
                price: currentService?.price || '',
            };

            formik.setValues(initialValues);

            setDescriptionVi(currentService?.descriptionVi);
            setDescriptionEn(currentService?.descriptionEn);
            setPreviewThumbnail(currentService?.thumbnailDataServices?.url);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentService, openDialogUpdate]);

    const formik = useFormik({
        initialValues: {
            keyMap: '',
            type: '',
            titleVi: '',
            titleEn: '',
            price: '',
        },
        validationSchema: Yup.object({
            keyMap: Yup.string().max(10).required('Key Map is required'),
            type: Yup.string().max(32).required('Type is required'),
            titleVi: Yup.string().required('Title vi is required'),
            titleEn: Yup.string().required('Title en is required'),
            price: Yup.number().required('Price is required'),
        }),
        enableReinitialize: true,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                setIsLoading(true);
                setSubmitting(true);

                handleToggleDialogUpdate();

                let formData = new FormData();
                formData.append('data', JSON.stringify({ ...values, descriptionVi, descriptionEn }));
                if (thumbnail) {
                    formData.append('file', thumbnail);
                }

                const response = await updateService_Service(axiosPrivate, currentService.id, formData);
                if (response) {
                    setIsLoading(false);
                    setSubmitting(false);

                    setThumbnail(null);
                    setPreviewThumbnail(null);

                    setDescriptionVi('');
                    setDescriptionEn('');

                    getAllServices();
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
                    maxWidth="lg"
                    PaperProps={{
                        style: {
                            width: '80%',
                        },
                    }}
                    open={openDialogUpdate}
                    onClose={handleToggleDialogUpdate}
                    aria-labelledby="form-dialog-update"
                >
                    <DialogTitle id="form-dialog-update">
                        <HeaderComponent
                            title={<FormattedMessage id="dashboardAdmin.services.title" />}
                            subtitle={<FormattedMessage id="dashboardAdmin.services.updateSubtitle" />}
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
                                        sx={{ gridColumn: 'span 2' }}
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
                                        sx={{ gridColumn: 'span 2' }}
                                    />
                                </Grid>
                                <Grid xs={12} lg={6}>
                                    <TextField
                                        error={!!(formik.touched.titleEn && !!formik.errors.titleEn)}
                                        fullWidth
                                        helperText={formik.touched.titleEn && formik.errors.titleEn}
                                        variant="filled"
                                        label="Title en"
                                        name="titleEn"
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        type="text"
                                        value={formik.values.titleEn}
                                        sx={{ gridColumn: 'span 2' }}
                                    />
                                </Grid>
                                <Grid xs={12} lg={6}>
                                    <TextField
                                        error={!!(formik.touched.titleVi && !!formik.errors.titleVi)}
                                        fullWidth
                                        helperText={formik.touched.titleVi && formik.errors.titleVi}
                                        variant="filled"
                                        label="Title vi"
                                        name="titleVi"
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        type="text"
                                        value={formik.values.titleVi}
                                        sx={{ gridColumn: 'span 2' }}
                                    />
                                </Grid>

                                <Grid xs={12} lg={6}>
                                    <TextField
                                        error={!!(formik.touched.price && !!formik.errors.price)}
                                        fullWidth
                                        helperText={formik.touched.price && formik.errors.price}
                                        variant="filled"
                                        label="Price"
                                        name="price"
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        type="text"
                                        value={formik.values.price}
                                        sx={{ gridColumn: 'span 2' }}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">vnd</InputAdornment>,
                                        }}
                                    />
                                </Grid>
                                <Grid xs={12} lg={12}>
                                    <Typography sx={{ color: 'grey' }} mb={1}>
                                        Description in Vietnamese
                                    </Typography>
                                    <CKEditor
                                        editor={ClassicEditor}
                                        data={descriptionVi}
                                        onChange={handleChangeDescriptionVi}
                                    />
                                </Grid>
                                <Grid xs={12} lg={12}>
                                    <Typography sx={{ color: 'grey' }} mb={1}>
                                        Description in English
                                    </Typography>
                                    <CKEditor
                                        editor={ClassicEditor}
                                        data={descriptionEn}
                                        onChange={handleChangeDescriptionEn}
                                    />
                                </Grid>
                                <Grid container xs={12} lg={12}>
                                    <Grid>
                                        <Button
                                            onChange={handleChangeThumbnail}
                                            component="label"
                                            variant="outlined"
                                            color="info"
                                            startIcon={<CloudUpload />}
                                        >
                                            Upload thumbnail
                                            <VisuallyHiddenInput type="file" />
                                        </Button>
                                    </Grid>

                                    <Grid xs={3}>
                                        <Badge
                                            overlap="circular"
                                            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                            badgeContent={
                                                <Cancel
                                                    sx={{ cursor: 'pointer' }}
                                                    color="error"
                                                    onClick={() => handleRemove()}
                                                />
                                            }
                                        >
                                            <Image src={previewThumbnail ? previewThumbnail : ''} />
                                        </Badge>
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

DialogUpdateService.propTypes = {
    openDialogUpdate: PropTypes.bool,
    handleToggleDialogUpdate: PropTypes.func,
    getAllServices: PropTypes.func,
    currentCode: PropTypes.object,
};
export default DialogUpdateService;
