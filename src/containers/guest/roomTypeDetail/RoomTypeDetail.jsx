import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import {
    Box,
    Unstable_Grid2 as Grid,
    Button,
    Paper,
    Typography,
    Chip,
    List,
    ListItem,
    ListItemAvatar,
    ListItemIcon,
    ListItemText,
    Avatar,
    Rating,
    IconButton,
    Dialog,
    DialogContent,
    DialogActions,
    Stack,
    Divider,
    Pagination,
} from '@mui/material';
import {
    StraightenOutlined,
    PersonOutlineOutlined,
    CircleOutlined,
    SentimentSatisfiedAlt,
    KingBed,
} from '@mui/icons-material';

import { Input } from 'antd';
import { Carousel } from 'antd';

import dayjs from 'dayjs';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import _ from 'lodash';
import * as DOMPurify from 'dompurify';

import { FormattedMessage } from 'react-intl';
import { toast } from 'react-toastify';

import LoadingOverlay from 'components/common/LoadingOverlay';

import useAxiosPrivate from 'hooks/useAxiosPrivate';
import { getRoomTypeService } from 'services/roomTypesService';
import { createReviewService, getAllReviewsByRoomTypeIdWithPaginationService } from 'services/reviewsService';

import { LANGUAGES, NOT_FOUND, formatCurrencyVND, formatCurrencyUSD, AUTH_PATHS } from 'utils';

const RoomTypeDetail = () => {
    const { roomTypeId } = useParams();
    const navigate = useNavigate();

    const axiosPrivate = useAxiosPrivate();

    const language = useSelector(state => state.app.language);
    const userId = useSelector(state => state.auth.userInfo?.id || '');
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

    const [openDialogSignInRequire, setOpenDialogSignInRequire] = useState(false);

    const [star, setStar] = useState(5);

    const [page, setPage] = useState(1);
    const [size, setSize] = useState(0);

    const PER_PAGE = 4;

    const [roomType, setRoomType] = useState({});
    const [allReviews, setAllReviews] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

    const { TextArea } = Input;

    const handleChangePage = (event, page) => {
        setPage(page);
    };

    const getRoomType = async () => {
        try {
            setIsLoading(true);
            const response = await getRoomTypeService(roomTypeId);
            if (response?.data) {
                setIsLoading(false);
                setRoomType(response.data);
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error(error.message);
            }
            setIsLoading(false);
            navigate(NOT_FOUND);
        } finally {
            setIsLoading(false);
        }
    };
    const getAllReviews = async () => {
        try {
            setIsLoading(true);
            const response = await getAllReviewsByRoomTypeIdWithPaginationService(page, PER_PAGE, roomTypeId);
            if (response?.data) {
                setIsLoading(false);

                setAllReviews(response.data);
                setSize(response?.totalPages ? response.totalPages : 0);
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error(error.message);
            }
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getRoomType();
        getAllReviews();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        getAllReviews();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    const rules = [
        { valueVi: 'Nhận phòng : 14:00pm', valueEn: 'Check-in : 14:00pm' },
        { valueVi: 'Trả phòng  : 12:00pm', valueEn: 'Checkout : 12:00pm' },
        {
            valueVi: 'Trả phòng trễ: Phụ thu 50% giá phòng.',
            valueEn: 'Late Checkout: Additional charge 50% of the room rate.',
        },
        {
            valueVi: 'Giấy tờ tùy thân là bắt buộc để đăng ký khách sạn.',
            valueEn: 'Identification document is must for hotel registration.',
        },
    ];

    const formik = useFormik({
        initialValues: {
            review: '',
        },
        validationSchema: Yup.object({
            review: Yup.string().max(100, 'Maximum of 100 characters').required('Review is required'),
        }),
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                if (isLoggedIn) {
                    setIsLoading(true);
                    setSubmitting(true);

                    const response = await createReviewService(axiosPrivate, {
                        ...values,
                        star,
                        userId,
                        roomTypeId,
                    });
                    if (response) {
                        setIsLoading(false);
                        setSubmitting(false);

                        getAllReviews();
                        toast.success(response.data.message);
                        resetForm();
                    }
                } else {
                    setOpenDialogSignInRequire(!openDialogSignInRequire);
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
            <Box
                sx={{
                    flex: '1 1 auto',
                }}
            >
                <LoadingOverlay isLoading={isLoading} />

                <Carousel autoplay>
                    {roomType?.photosDataRoomTypes &&
                        roomType.photosDataRoomTypes.map((item, index) => {
                            return (
                                <Paper
                                    key={index}
                                    sx={{
                                        position: 'relative',
                                        height: '70vh',
                                        color: '#fff',
                                        backgroundSize: 'cover',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'center',
                                        backgroundImage: `url(${item?.url})`,
                                        backgroundAttachment: 'fixed',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: '100%',
                                            height: '30%',
                                            position: 'absolute',
                                            bottom: 0,
                                            backgroundImage: ' linear-gradient(0, rgba(0, 0, 0, 0.95), transparent)',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Typography
                                            pl={10}
                                            component="h1"
                                            variant="h2"
                                            color="inherit"
                                            sx={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}
                                        >
                                            {language === LANGUAGES.VI
                                                ? roomType?.roomTypeDataRoomTypes?.valueVi
                                                : roomType?.roomTypeDataRoomTypes?.valueEn}
                                        </Typography>
                                        <Typography
                                            pr={10}
                                            component="h1"
                                            variant="h2"
                                            color="inherit"
                                            sx={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}
                                        >
                                            {language === LANGUAGES.VI
                                                ? formatCurrencyVND(roomType?.pricePerNight)
                                                : formatCurrencyUSD(roomType?.pricePerNight)}
                                            / Night
                                        </Typography>
                                    </Box>
                                </Paper>
                            );
                        })}
                </Carousel>
                <Box py={5} px={10}>
                    <Grid container mb={4} xs={12} lg={12} columnSpacing={2}>
                        <Grid container>
                            <Grid>
                                <KingBed sx={{ color: '#ab6034' }} />
                            </Grid>
                            <Grid>
                                {language === LANGUAGES.VI
                                    ? roomType?.bedTypeData?.valueVi
                                    : roomType?.bedTypeData?.valueEn}
                            </Grid>
                        </Grid>

                        <Grid container>
                            <Grid>
                                <PersonOutlineOutlined sx={{ color: '#ab6034' }} />
                            </Grid>
                            <Grid>{roomType?.occupancy}</Grid>
                        </Grid>

                        <Grid container>
                            <Grid>
                                <StraightenOutlined sx={{ color: '#ab6034' }} />
                            </Grid>
                            <Grid>{roomType?.size}m2</Grid>
                        </Grid>
                    </Grid>
                    <Box>
                        <Typography variant="h3">
                            <FormattedMessage id="guest.roomTypeDetail.description" />
                        </Typography>
                        <Box sx={{ color: '#696969' }}>
                            {language === LANGUAGES.VI ? (
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: DOMPurify.sanitize(roomType?.descriptionVi),
                                    }}
                                />
                            ) : (
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: DOMPurify.sanitize(roomType?.descriptionEn),
                                    }}
                                />
                            )}
                        </Box>
                    </Box>
                    <Box mb={3}>
                        <Typography variant="h3" mb={3}>
                            <FormattedMessage id="guest.roomTypeDetail.amenities" />
                        </Typography>

                        <Paper
                            sx={{
                                m: 0,
                                py: 3,
                            }}
                            component="ul"
                        >
                            <Grid container spacing={2} lg={12}>
                                {roomType?.amenitiesData &&
                                    roomType?.amenitiesData.map((data, index) => {
                                        return (
                                            <Grid key={index}>
                                                <Chip
                                                    label={
                                                        language === LANGUAGES.VI
                                                            ? data.amenitiesTypeData.valueVi
                                                            : data.amenitiesTypeData.valueEn
                                                    }
                                                />
                                            </Grid>
                                        );
                                    })}
                            </Grid>
                        </Paper>
                    </Box>
                    <Box mb={3}>
                        <Typography variant="h3" mb={3}>
                            <FormattedMessage id="guest.roomTypeDetail.rules" />
                        </Typography>

                        <Paper
                            sx={{
                                m: 0,
                                py: 3,
                            }}
                        >
                            <List>
                                {rules &&
                                    rules.map((item, index) => {
                                        return (
                                            <ListItem key={index}>
                                                <ListItemIcon>
                                                    <CircleOutlined sx={{ color: '#ab6034' }} />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                                />
                                            </ListItem>
                                        );
                                    })}
                            </List>
                        </Paper>
                    </Box>

                    <Box mb={3}>
                        <Typography variant="h3" mb={3}>
                            <FormattedMessage id="guest.roomTypeDetail.createReviews" />
                        </Typography>
                        <Paper
                            sx={{
                                m: 0,
                                py: 2,
                                px: 2,
                            }}
                        >
                            <Typography mb={1} component="legend">
                                <FormattedMessage id="guest.roomTypeDetail.yourRating" />
                            </Typography>
                            <Box mb={1}>
                                <Rating
                                    name="simple-controlled"
                                    value={star}
                                    onChange={(event, newValue) => {
                                        setStar(newValue);
                                    }}
                                />
                            </Box>

                            <form noValidate onSubmit={formik.handleSubmit}>
                                <Grid container xs={12} lg={6} spacing={2}>
                                    <Grid xs={12} lg={12}>
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
                                    <Grid>
                                        <Button
                                            variant="contained"
                                            type="submit"
                                            sx={{
                                                backgroundColor: '#ab6034',
                                                color: 'white',
                                            }}
                                        >
                                            <FormattedMessage id="guest.roomTypeDetail.submit" />
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </Paper>
                    </Box>

                    <Box>
                        <Typography variant="h3" mb={3}>
                            <FormattedMessage id="guest.roomTypeDetail.reviews" />
                        </Typography>
                        <Paper>
                            <List sx={{ width: '100%' }}>
                                {!_.isEmpty(allReviews) ? (
                                    allReviews.map((item, index) => {
                                        return (
                                            <ListItem key={index} alignItems="center">
                                                <ListItemAvatar>
                                                    <Avatar alt="avatar" src={item?.avatarData?.url} />
                                                </ListItemAvatar>
                                                <Grid xs={12} lg={12}>
                                                    <Typography variant="body2">
                                                        {item?.userDataReviews?.firstName}
                                                    </Typography>

                                                    <Rating name="read-only" value={item?.star} readOnly size="small" />

                                                    <Typography variant="body2">{item?.review}</Typography>

                                                    <Typography variant="caption">
                                                        {dayjs(item?.createdAt).format('DD/MM/YYYY')}
                                                    </Typography>
                                                </Grid>
                                            </ListItem>
                                        );
                                    })
                                ) : (
                                    <Typography ml={2}>
                                        <FormattedMessage id="guest.roomTypeDetail.emptyReviews" />
                                    </Typography>
                                )}
                            </List>
                            <Box p={2} display="flex" justifyContent="center">
                                <Stack spacing={2}>
                                    <Pagination count={size} page={page} onChange={handleChangePage} />
                                </Stack>
                            </Box>
                        </Paper>
                    </Box>
                </Box>
                {openDialogSignInRequire && (
                    <Dialog
                        fullWidth
                        maxWidth="lg"
                        PaperProps={{
                            style: {
                                width: '70%',
                            },
                        }}
                        open={openDialogSignInRequire}
                        onClose={() => setOpenDialogSignInRequire(!openDialogSignInRequire)}
                        aria-labelledby="dialog-sign-in-require"
                    >
                        <DialogContent>
                            <Stack spacing={1}>
                                <Box
                                    p={1}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'flex-start',
                                        alignItems: 'center',
                                        gap: '10px',
                                    }}
                                >
                                    <IconButton color="success" size="large">
                                        <SentimentSatisfiedAlt fontSize="large" />
                                    </IconButton>
                                    <Box>
                                        <Typography id="sign-in-require" variant="h4" mb={2}>
                                            <FormattedMessage id="guest.roomTypeDetail.signInRequire" />
                                        </Typography>
                                        <Button
                                            onClick={() => navigate(AUTH_PATHS.SIGN_IN)}
                                            variant="contained"
                                            color="secondary"
                                        >
                                            <FormattedMessage id="guest.roomTypeDetail.goToSignIn" />
                                        </Button>
                                    </Box>
                                </Box>
                                <Divider />
                                <DialogActions>
                                    <Button
                                        onClick={() => setOpenDialogSignInRequire(!openDialogSignInRequire)}
                                        variant="contained"
                                        color="text"
                                    >
                                        <FormattedMessage id="dashboardCommon.cancel" />
                                    </Button>
                                </DialogActions>
                            </Stack>
                        </DialogContent>
                    </Dialog>
                )}
            </Box>
        </>
    );
};
export default RoomTypeDetail;
