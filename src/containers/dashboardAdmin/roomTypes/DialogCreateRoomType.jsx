import { useEffect, useState } from 'react';
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
    Typography,
    Paper,
    Chip,
    styled,
    Unstable_Grid2 as Grid,
    FormHelperText,
} from '@mui/material';

import { toast } from 'react-toastify';
import { FormattedMessage } from 'react-intl';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import _ from 'lodash';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import HeaderComponent from 'components/dashboard/HeaderComponent';
import LoadingOverlay from 'components/common/LoadingOverlay';
import UploadMultiple from 'components/common/UploadMultiple';

import useAxiosPrivate from 'hooks/useAxiosPrivate';
import { createRoomTypeService } from 'services/roomTypesService';
import { getAllCodesByTypeService } from 'services/allCodesService';

import { LANGUAGES } from 'utils';

const DialogCreateRoomType = props => {
    const { openDialogCreate, handleToggleDialogCreate, getAllRoomTypes, setIsLoading } = props;

    const axiosPrivate = useAxiosPrivate();
    const language = useSelector(state => state.app.language || 'vi');

    const [allRoomType, setAllRoomType] = useState([]);
    const [allBedType, setAllBedType] = useState([]);
    const [allAmenitiesType, setAllAmenitiesType] = useState([]);

    const [loadingRoomType, setLoadingRoomType] = useState(false);
    const [loadingBedType, setLoadingBedType] = useState(false);
    const [loadingAllAmenitiesType, setLoadingAllAmenitiesType] = useState(false);

    const [amenities, setAmenities] = useState({});
    const [allAmenities, setAllAmenities] = useState([]);

    const [featuresVi, setFeaturesVi] = useState('');
    const [featuresEn, setFeaturesEn] = useState('');

    const [descriptionVi, setDescriptionVi] = useState('');
    const [descriptionEn, setDescriptionEn] = useState('');

    const [fileList, setFileList] = useState([]);

    const handleAddAmenities = amenities => {
        setAllAmenities(allAmenities => _.uniqWith([...allAmenities, amenities], _.isEqual));
        setAmenities(amenities);
    };

    const handleDeleteAmenities = amenitiesToDelete => () => {
        setAllAmenities(AllAmenities =>
            AllAmenities.filter(amenities => amenities.keyMap !== amenitiesToDelete.keyMap)
        );
    };

    const handleChangeFeaturesVi = (event, editor) => {
        const data = editor.getData();
        setFeaturesVi(data);
    };
    const handleChangeFeaturesEn = (event, editor) => {
        const data = editor.getData();
        setFeaturesEn(data);
    };

    const handleChangeDescriptionVi = (event, editor) => {
        const data = editor.getData();
        setDescriptionVi(data);
    };

    const handleChangeDescriptionEn = (event, editor) => {
        const data = editor.getData();
        setDescriptionEn(data);
    };

    const getAllRoomType = async () => {
        try {
            setLoadingRoomType(true);
            const response = await getAllCodesByTypeService('RoomType');
            if (response?.data) {
                setLoadingRoomType(false);
                setAllRoomType(response.data);
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error(error.message);
            }
            setLoadingRoomType(false);
        } finally {
            setLoadingRoomType(false);
        }
    };

    const getAllBedType = async () => {
        try {
            setLoadingBedType(true);
            const response = await getAllCodesByTypeService('BedType');
            if (response?.data) {
                setLoadingBedType(false);
                setAllBedType(response.data);
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error(error.message);
            }
            setLoadingBedType(false);
        } finally {
            setLoadingBedType(false);
        }
    };

    const getAllAmenities = async () => {
        try {
            setLoadingAllAmenitiesType(true);
            const response = await getAllCodesByTypeService('Amenities');
            if (response?.data) {
                setLoadingAllAmenitiesType(false);
                setAllAmenitiesType(response.data);
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error(error.message);
            }
            setLoadingAllAmenitiesType(false);
        } finally {
            setLoadingAllAmenitiesType(false);
        }
    };

    useEffect(() => {
        if (openDialogCreate) {
            getAllRoomType();
            getAllBedType();
            getAllAmenities();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openDialogCreate]);

    const formik = useFormik({
        initialValues: {
            roomTypeKey: '',
            bedTypeKey: '',
            pricePerNight: '',
            size: '',
            occupancy: '',
            checkInOutTime: '',
        },
        validationSchema: Yup.object({
            roomTypeKey: Yup.string().max(32, 'Maximum of 32 characters').required('Room type key is required'),
            bedTypeKey: Yup.string().max(32, 'Maximum of 32 characters').required('Bed type is required'),
            pricePerNight: Yup.number().required('Price Per Night is required'),
            size: Yup.number().max(200, 'Maximum of 200 m2').required('Size is required'),
            occupancy: Yup.number().max(10, 'Maximum of 10 occupancy').required('Occupancy Guests is required'),
            checkInOutTime: Yup.string()
                .max(50, 'Maximum of 50 characters')
                .required('Check In and Check Out Time is required'),
        }),
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                setIsLoading(true);
                setSubmitting(true);

                handleToggleDialogCreate();

                let formData = new FormData();

                if (!_.isEmpty(fileList)) {
                    const fileListUpload = fileList.map(item => {
                        return item.originFileObj;
                    });

                    if (!_.isEmpty(fileListUpload)) {
                        for (const file of fileListUpload) {
                            formData.append('files', file);
                        }
                    }
                }

                formData.append(
                    'data',
                    JSON.stringify({
                        ...values,
                        featuresVi,
                        featuresEn,
                        descriptionVi,
                        descriptionEn,
                        newAllAmenities: allAmenities,
                    })
                );

                const response = await createRoomTypeService(axiosPrivate, formData);
                if (response) {
                    setIsLoading(false);
                    setSubmitting(false);

                    setFeaturesVi('');
                    setFeaturesEn('');

                    setDescriptionVi('');
                    setDescriptionEn('');

                    setFileList([]);

                    setAllAmenities([]);

                    getAllRoomTypes();
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
    const ListItem = styled('li')(({ theme }) => ({
        margin: theme.spacing(0.5),
    }));
    return (
        <>
            {openDialogCreate && (
                <Box>
                    <Dialog
                        fullWidth
                        maxWidth="xl"
                        PaperProps={{
                            style: {
                                width: '90%',
                            },
                        }}
                        open={openDialogCreate}
                        onClose={handleToggleDialogCreate}
                        aria-labelledby="form-dialog-title"
                    >
                        <LoadingOverlay isLoading={loadingRoomType} />
                        <LoadingOverlay isLoading={loadingBedType} />
                        <LoadingOverlay isLoading={loadingAllAmenitiesType} />
                        <DialogTitle id="form-dialog-title">
                            <HeaderComponent
                                title={<FormattedMessage id="dashboardAdmin.roomTypes.title" />}
                                subtitle={<FormattedMessage id="dashboardAdmin.roomTypes.createSubtitle" />}
                            />
                        </DialogTitle>
                        <DialogContent>
                            <form noValidate onSubmit={formik.handleSubmit}>
                                <Grid mt={1} container spacing={3}>
                                    <Grid xs={12} lg={6}>
                                        <FormControl fullWidth variant="outlined">
                                            <InputLabel id="select-room-type">Room type</InputLabel>
                                            <Select
                                                error={!!(formik.touched.roomTypeKey && !!formik.errors.roomTypeKey)}
                                                labelId="select-room-type"
                                                name="roomTypeKey"
                                                label="Room type"
                                                onBlur={formik.handleBlur}
                                                onChange={formik.handleChange}
                                                value={formik.values.roomTypeKey}
                                            >
                                                {allRoomType &&
                                                    allRoomType.map((roomType, index) => {
                                                        return (
                                                            <MenuItem key={index} value={roomType.keyMap}>
                                                                {language === LANGUAGES.VI
                                                                    ? roomType.valueVi
                                                                    : roomType.valueEn}
                                                            </MenuItem>
                                                        );
                                                    })}
                                            </Select>
                                            <FormHelperText
                                                error={!!(formik.touched.roomTypeKey && !!formik.errors.roomTypeKey)}
                                            >
                                                {formik.touched.roomTypeKey && formik.errors.roomTypeKey}
                                            </FormHelperText>
                                        </FormControl>
                                    </Grid>

                                    <Grid xs={12} lg={6}>
                                        <FormControl fullWidth variant="outlined">
                                            <InputLabel id="select-bed-type">Bed type</InputLabel>
                                            <Select
                                                error={!!(formik.touched.bedTypeKey && !!formik.errors.bedTypeKey)}
                                                labelId="select-bed-type"
                                                name="bedTypeKey"
                                                label="Bed type"
                                                onBlur={formik.handleBlur}
                                                onChange={formik.handleChange}
                                                value={formik.values.bedTypeKey}
                                            >
                                                {allBedType &&
                                                    allBedType.map((bedType, index) => {
                                                        return (
                                                            <MenuItem key={index} value={bedType.keyMap}>
                                                                {language === LANGUAGES.VI
                                                                    ? bedType.valueVi
                                                                    : bedType.valueEn}
                                                            </MenuItem>
                                                        );
                                                    })}
                                            </Select>
                                            <FormHelperText
                                                error={!!(formik.touched.bedTypeKey && !!formik.errors.bedTypeKey)}
                                            >
                                                {formik.touched.bedTypeKey && formik.errors.bedTypeKey}
                                            </FormHelperText>
                                        </FormControl>
                                    </Grid>
                                    <Grid xs={12} lg={3}>
                                        <TextField
                                            error={!!(formik.touched.pricePerNight && !!formik.errors.pricePerNight)}
                                            fullWidth
                                            helperText={formik.touched.pricePerNight && formik.errors.pricePerNight}
                                            variant="outlined"
                                            label="Price per night"
                                            name="pricePerNight"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            type="text"
                                            value={formik.values.pricePerNight}
                                        />
                                    </Grid>

                                    <Grid xs={12} lg={3}>
                                        <TextField
                                            error={!!(formik.touched.size && !!formik.errors.size)}
                                            fullWidth
                                            helperText={formik.touched.size && formik.errors.size}
                                            variant="outlined"
                                            label="Size m2"
                                            name="size"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            type="text"
                                            value={formik.values.size}
                                        />
                                    </Grid>
                                    <Grid xs={12} lg={3}>
                                        <TextField
                                            error={!!(formik.touched.occupancy && !!formik.errors.occupancy)}
                                            fullWidth
                                            helperText={formik.touched.occupancy && formik.errors.occupancy}
                                            variant="outlined"
                                            label="Occupancy"
                                            name="occupancy"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            type="text"
                                            value={formik.values.occupancy}
                                        />
                                    </Grid>

                                    <Grid xs={12} lg={3}>
                                        <TextField
                                            fullWidth
                                            error={!!(formik.touched.checkInOutTime && !!formik.errors.checkInOutTime)}
                                            helperText={formik.touched.checkInOutTime && formik.errors.checkInOutTime}
                                            variant="outlined"
                                            label="Check-in and check-out time"
                                            name="checkInOutTime"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            type="text"
                                            value={formik.values.checkInOutTime}
                                        />
                                    </Grid>

                                    <Grid container xs={12} lg={12}>
                                        <Grid xs={12} lg={6}>
                                            <FormControl fullWidth variant="outlined">
                                                <InputLabel id="select-amenities">Amenities</InputLabel>
                                                <Select labelId="select-amenities" value={amenities} label="Amenities">
                                                    {allAmenitiesType &&
                                                        allAmenitiesType.map((amenities, index) => {
                                                            return (
                                                                <MenuItem
                                                                    onClick={() => handleAddAmenities(amenities)}
                                                                    key={index}
                                                                    value={amenities}
                                                                >
                                                                    {language === LANGUAGES.VI
                                                                        ? amenities.valueVi
                                                                        : amenities.valueEn}
                                                                </MenuItem>
                                                            );
                                                        })}
                                                </Select>
                                            </FormControl>
                                        </Grid>

                                        <Grid xs={12} lg={6}>
                                            <Paper
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    flexWrap: 'wrap',
                                                    listStyle: 'none',
                                                    p: 0.5,
                                                    m: 0,
                                                }}
                                                component="ul"
                                            >
                                                {allAmenities.map((data, index) => {
                                                    let icon;

                                                    return (
                                                        <ListItem key={index}>
                                                            <Chip
                                                                icon={icon}
                                                                label={
                                                                    language === LANGUAGES.VI
                                                                        ? data.valueVi
                                                                        : data.valueEn
                                                                }
                                                                onDelete={handleDeleteAmenities(data)}
                                                            />
                                                        </ListItem>
                                                    );
                                                })}
                                            </Paper>
                                        </Grid>
                                    </Grid>

                                    <Grid xs={12} lg={12}>
                                        <Typography sx={{ color: 'grey' }} mb={1}>
                                            <FormattedMessage id="dashboardAdmin.roomTypes.detail.featuresVi" />
                                        </Typography>
                                        <CKEditor
                                            editor={ClassicEditor}
                                            data={featuresVi}
                                            onChange={handleChangeFeaturesVi}
                                        />
                                    </Grid>
                                    <Grid xs={12} lg={12}>
                                        <Typography sx={{ color: 'grey' }} mb={1}>
                                            <FormattedMessage id="dashboardAdmin.roomTypes.detail.featuresEn" />
                                        </Typography>
                                        <CKEditor
                                            editor={ClassicEditor}
                                            data={featuresEn}
                                            onChange={handleChangeFeaturesEn}
                                        />
                                    </Grid>

                                    <Grid xs={12} lg={12}>
                                        <Typography sx={{ color: 'grey' }} mb={1}>
                                            <FormattedMessage id="dashboardAdmin.roomTypes.detail.descriptionVi" />
                                        </Typography>
                                        <CKEditor
                                            editor={ClassicEditor}
                                            data={descriptionVi}
                                            onChange={handleChangeDescriptionVi}
                                        />
                                    </Grid>
                                    <Grid xs={12} lg={12}>
                                        <Typography sx={{ color: 'grey' }} mb={1}>
                                            <FormattedMessage id="dashboardAdmin.roomTypes.detail.descriptionEn" />
                                        </Typography>
                                        <CKEditor
                                            editor={ClassicEditor}
                                            data={descriptionEn}
                                            onChange={handleChangeDescriptionEn}
                                        />
                                    </Grid>
                                    <Grid xs={12} lg={12}>
                                        <UploadMultiple fileList={fileList} setFileList={setFileList} />
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
                </Box>
            )}
        </>
    );
};

DialogCreateRoomType.propTypes = {
    openDialogCreate: PropTypes.bool,
    handleToggleDialogCreate: PropTypes.func,
    getAllRoomTypes: PropTypes.func,
};
export default DialogCreateRoomType;
