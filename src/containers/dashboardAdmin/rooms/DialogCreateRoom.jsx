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
    Unstable_Grid2 as Grid,
    FormHelperText,
} from '@mui/material';

import { toast } from 'react-toastify';
import { FormattedMessage } from 'react-intl';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import HeaderComponent from 'components/dashboard/HeaderComponent';
import LoadingOverlay from 'components/common/LoadingOverlay';

import useAxiosPrivate from 'hooks/useAxiosPrivate';
import { createRoomService } from 'services/roomsService';
import { getAllCodesByTypeService } from 'services/allCodesService';

import { LANGUAGES } from 'utils';

const DialogCreateRoom = props => {
    const { openDialogCreate, handleToggleDialogCreate, getAllRooms, setIsLoading } = props;

    const axiosPrivate = useAxiosPrivate();
    const language = useSelector(state => state.app.language || 'vi');

    const [allRoomType, setAllRoomType] = useState([]);
    const [loadingRoomType, setLoadingRoomType] = useState(false);

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

    useEffect(() => {
        if (openDialogCreate) {
            getAllRoomType();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openDialogCreate]);

    const formik = useFormik({
        initialValues: {
            number: '',
            roomTypeKey: '',
        },
        validationSchema: Yup.object({
            number: Yup.number().required('Number is required'),
            roomTypeKey: Yup.string().max(32, 'Maximum of 32 characters').required('Room type is required'),
        }),
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                setIsLoading(true);
                setSubmitting(true);

                handleToggleDialogCreate();

                const response = await createRoomService(axiosPrivate, values);
                if (response) {
                    setIsLoading(false);
                    setSubmitting(false);

                    getAllRooms();
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

                        <DialogTitle id="form-dialog-title">
                            <HeaderComponent
                                title={<FormattedMessage id="dashboardAdmin.rooms.title" />}
                                subtitle={<FormattedMessage id="dashboardAdmin.rooms.createSubtitle" />}
                            />
                        </DialogTitle>
                        <DialogContent>
                            <form noValidate onSubmit={formik.handleSubmit}>
                                <Grid mt={1} container spacing={3}>
                                    <Grid xs={12} lg={6}>
                                        <TextField
                                            fullWidth
                                            error={!!(formik.touched.number && !!formik.errors.number)}
                                            helperText={formik.touched.number && formik.errors.number}
                                            variant="outlined"
                                            label="Number"
                                            name="number"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            type="text"
                                            value={formik.values.number}
                                        />
                                    </Grid>
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

DialogCreateRoom.propTypes = {
    openDialogCreate: PropTypes.bool,
    handleToggleDialogCreate: PropTypes.func,
    getAllRooms: PropTypes.func,
};
export default DialogCreateRoom;
