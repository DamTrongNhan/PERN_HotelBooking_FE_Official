import { useState } from 'react';

import PropTypes from 'prop-types';

import {
    TextField,
    Button,
    InputAdornment,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Badge,
    styled,
    Unstable_Grid2 as Grid,
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
import { createService_Service } from 'services/services_Service';

import { getBase64 } from 'utils';

const DialogCreateService = props => {
    const { openDialogCreate, handleToggleDialogCreate, getAllServices, setIsLoading } = props;
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

    const formik = useFormik({
        initialValues: {
            type: '',
            keyMap: '',
            titleVi: '',
            titleEn: '',
            price: '',
        },
        validationSchema: Yup.object({
            type: Yup.string().max(32).required('Type is required'),
            keyMap: Yup.string().max(10).required('Key Map is required'),
            titleVi: Yup.string().required('Value Vi is required'),
            titleEn: Yup.string().required('Value En is required'),
            price: Yup.number().required('Price is required'),
        }),
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                setIsLoading(true);
                setSubmitting(true);

                handleToggleDialogCreate();

                let formData = new FormData();
                formData.append('data', JSON.stringify({ ...values, descriptionVi, descriptionEn }));
                if (thumbnail) {
                    formData.append('file', thumbnail);
                }
                const response = await createService_Service(axiosPrivate, formData);
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
                            title={<FormattedMessage id="dashboardAdmin.services.title" />}
                            subtitle={<FormattedMessage id="dashboardAdmin.services.createSubtitle" />}
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

DialogCreateService.propTypes = {
    openDialogCreate: PropTypes.bool,
    handleToggleDialogCreate: PropTypes.func,
    getAllServices: PropTypes.func,
};
export default DialogCreateService;
