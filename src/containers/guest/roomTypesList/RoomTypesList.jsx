import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
    Box,
    Unstable_Grid2 as Grid,
    useTheme,
    Button,
    OutlinedInput,
    InputAdornment,
    IconButton,
    InputLabel,
    FormControl,
    Typography,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Dialog,
    DialogContent,
    DialogActions,
    Stack,
    Pagination,
} from '@mui/material';
import {
    Category,
    Sort,
    SquareFootOutlined,
    PersonOutline,
    ChildCare,
    AccessTime,
    Person,
    KingBed,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { FormattedMessage } from 'react-intl';
import { toast } from 'react-toastify';

import dayjs from 'dayjs';
import * as DOMPurify from 'dompurify';
import _ from 'lodash';

import LoadingOverlay from 'components/common/LoadingOverlay';

import { getAllRoomTypesWithPaginationService } from 'services/roomTypesService';
import { getAllRoomsAvailableByRoomTypeKeyService } from 'services/roomsService';

import { LANGUAGES, GUEST_PATHS, formatCurrencyVND, formatCurrencyUSD } from 'utils';

const RoomTypesList = () => {
    const navigate = useNavigate();

    const language = useSelector(state => state.app.language);
    const { checkIn, checkOut, adult, child, days } = useSelector(state => state.bookingData);

    const [openDialogChooseRoom, setOpenDialogChooseRoom] = useState(false);

    const [page, setPage] = useState(1);
    const [size, setSize] = useState(0);

    const PER_PAGE = 3;

    const [allRoomTypes, setAllRoomTypes] = useState([]);
    const [allRooms, setAllRooms] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

    const checkInDate = dayjs(checkIn);
    const checkOutDate = dayjs(checkOut);

    const theme = useTheme();
    const alt = theme.palette.background.alt;

    const getAllRoomTypes = async () => {
        try {
            setIsLoading(true);
            const response = await getAllRoomTypesWithPaginationService(page, PER_PAGE);
            if (response?.data) {
                setIsLoading(false);

                setAllRoomTypes(response.data);
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

    const getAllRoomsAvailableByRoomTypeKey = async roomTypeKey => {
        try {
            setIsLoading(true);
            const checkInIso = dayjs(checkIn).toISOString();
            const checkOutIso = dayjs(checkOut).toISOString();
            const response = await getAllRoomsAvailableByRoomTypeKeyService(roomTypeKey, checkInIso, checkOutIso);
            if (response?.data) {
                setIsLoading(false);
                setAllRooms(response.data);
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
        getAllRoomTypes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        getAllRoomTypes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    const handleChangePage = (event, page) => {
        setPage(page);
    };

    const handleToggleDialogChooseRoom = () => {
        setOpenDialogChooseRoom(!openDialogChooseRoom);
        setAllRooms([]);
    };

    const handleChooseRoom = roomTypeKey => {
        setOpenDialogChooseRoom(!openDialogChooseRoom);
        getAllRoomsAvailableByRoomTypeKey(roomTypeKey);
    };

    return (
        <>
            <Box
                py={5}
                px={{ xs: 5, lg: 7 }}
                sx={{
                    display: 'flex',
                    flex: '1 1 auto',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                }}
            >
                <LoadingOverlay isLoading={isLoading} />
                <Grid
                    lg={12}
                    xs={12}
                    container
                    backgroundColor={alt}
                    p={2}
                    mb={2}
                    spacing={2}
                    sx={{
                        justifyContent: 'center',
                        borderRadius: '10px',
                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
                    }}
                >
                    <Grid xs={12} lg={2}>
                        <DatePicker
                            disabled
                            sx={{ width: '100%' }}
                            label={'Check in'}
                            value={checkInDate}
                            format="DD-MM-YYYY"
                        />
                    </Grid>
                    <Grid xs={12} lg={2}>
                        <DatePicker
                            disabled
                            sx={{ width: '100%' }}
                            label={'Check out'}
                            value={checkOutDate}
                            format="DD-MM-YYYY"
                        />
                    </Grid>
                    <Grid xs={12} lg={2}>
                        <FormControl disabled fullWidth variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-adult">Adult</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-adult"
                                type="number"
                                value={adult}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton edge="end">
                                            <PersonOutline />
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="adult"
                            />
                        </FormControl>
                    </Grid>
                    <Grid xs={12} lg={2}>
                        <FormControl disabled fullWidth variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-child">Child</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-child"
                                type="number"
                                value={child}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton edge="end">
                                            <ChildCare />
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="child"
                            />
                        </FormControl>
                    </Grid>
                    <Grid xs={12} lg={2}>
                        <FormControl disabled fullWidth variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-days">Days</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-days"
                                type="number"
                                value={days}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton edge="end">
                                            <AccessTime />
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="days"
                            />
                        </FormControl>
                    </Grid>
                </Grid>

                <Box
                    width="100%"
                    mb={2}
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                    <Box>
                        <Typography>
                            {allRoomTypes.length} <FormattedMessage id="guest.roomTypesList.found" />
                        </Typography>
                    </Box>

                    <Box>
                        <IconButton>
                            <Sort />
                        </IconButton>
                        <IconButton>
                            <Category />
                        </IconButton>
                    </Box>
                </Box>

                <Grid container xs={12} lg={12} spacing={4} pb={2}>
                    {allRoomTypes &&
                        allRoomTypes.map((item, index) => {
                            return (
                                <Grid key={index} xs={12} sm={6} md={4}>
                                    <Card
                                        sx={{
                                            backgroundColor: 'white',
                                            color: 'black',
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                        }}
                                    >
                                        <CardMedia
                                            onClick={() => navigate(`${GUEST_PATHS.ROOM_TYPE_DETAIL_NO_ID}${item.id}`)}
                                            component="div"
                                            sx={{
                                                // 16:9
                                                pt: '56.25%',
                                                cursor: 'pointer',
                                                overflow: 'hidden',
                                                transition: 'transform 0.3s ease',
                                                '&:hover': {
                                                    transform: 'scale(1.1)',
                                                },
                                            }}
                                            image={item?.photosDataRoomTypes[0]?.url}
                                        />
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Typography gutterBottom variant="h4" component="h2">
                                                {language === LANGUAGES.VI
                                                    ? item?.roomTypeDataRoomTypes?.valueVi
                                                    : item?.roomTypeDataRoomTypes?.valueEn}
                                            </Typography>
                                            <Grid lg={12} container spacing={2}>
                                                <Grid container lg={6}>
                                                    <Grid>
                                                        <KingBed sx={{ color: '#ab6034' }} />
                                                    </Grid>
                                                    <Grid>
                                                        {language === LANGUAGES.VI
                                                            ? item?.bedTypeData?.valueVi
                                                            : item?.bedTypeData?.valueEn}
                                                    </Grid>
                                                </Grid>
                                                <Grid container lg={6}>
                                                    <Grid>
                                                        <Person sx={{ color: '#ab6034' }} />
                                                    </Grid>
                                                    <Grid>{item?.occupancy}</Grid>
                                                </Grid>
                                                <Grid container lg={6}>
                                                    <Grid>
                                                        <SquareFootOutlined sx={{ color: '#ab6034' }} />
                                                    </Grid>
                                                    <Grid>{item?.size}m2</Grid>
                                                </Grid>
                                            </Grid>

                                            <Box sx={{ color: 'grey' }}>
                                                {language === LANGUAGES.VI ? (
                                                    <div
                                                        dangerouslySetInnerHTML={{
                                                            __html: DOMPurify.sanitize(item?.featuresVi),
                                                        }}
                                                    />
                                                ) : (
                                                    <div
                                                        dangerouslySetInnerHTML={{
                                                            __html: DOMPurify.sanitize(item?.featuresEn),
                                                        }}
                                                    />
                                                )}
                                            </Box>
                                        </CardContent>
                                        <CardActions>
                                            <Grid xs={12} lg={12} container rowSpacing={2}>
                                                <Grid ml={1} xs={12} lg={12}>
                                                    <Typography variant="h4" color="error">
                                                        {language === LANGUAGES.VI
                                                            ? formatCurrencyVND(item?.pricePerNight)
                                                            : formatCurrencyUSD(item?.pricePerNight)}
                                                    </Typography>
                                                </Grid>
                                                <Grid xs={12} lg={12}>
                                                    <Button
                                                        onClick={() => handleChooseRoom(item.roomTypeKey)}
                                                        fullWidth
                                                        variant="contained"
                                                        size="large"
                                                        sx={{
                                                            backgroundColor: '#ab6034',
                                                            color: 'white',
                                                        }}
                                                    >
                                                        <FormattedMessage id="guest.roomTypesList.book" />
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            );
                        })}
                    <Grid container xs={12} lg={12} sx={{ justifyContent: 'center' }}>
                        <Stack spacing={2}>
                            <Pagination count={size} page={page} onChange={handleChangePage} />
                        </Stack>
                    </Grid>
                </Grid>

                {openDialogChooseRoom && (
                    <Dialog
                        fullWidth
                        maxWidth="lg"
                        PaperProps={{
                            style: {
                                width: '80%',
                            },
                        }}
                        open={openDialogChooseRoom}
                        onClose={handleToggleDialogChooseRoom}
                    >
                        <LoadingOverlay isLoading={isLoading} />
                        <Typography mt={2} ml={3} variant="h3">
                            <FormattedMessage id="guest.roomTypesList.chooseRoom" />
                        </Typography>
                        <DialogContent>
                            <Grid container xs={12} lg={12} spacing={2}>
                                {!_.isEmpty(allRooms) ? (
                                    allRooms.map((item, index) => {
                                        return (
                                            <Grid key={index}>
                                                <Button
                                                    onClick={() => navigate(`${GUEST_PATHS.BOOKING_NO_ID}${item.id}`)}
                                                    variant="contained"
                                                    color="primary"
                                                >
                                                    <FormattedMessage id="guest.roomTypesList.roomNumber" />
                                                    {item?.number}
                                                </Button>
                                            </Grid>
                                        );
                                    })
                                ) : (
                                    <Typography ml={1}>
                                        <FormattedMessage id="guest.roomTypesList.roomNotAvailable" />
                                    </Typography>
                                )}
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => handleToggleDialogChooseRoom()} color="text" variant="contained">
                                <FormattedMessage id="dashboardCommon.cancel" />
                            </Button>
                        </DialogActions>
                    </Dialog>
                )}
            </Box>
        </>
    );
};
export default RoomTypesList;
