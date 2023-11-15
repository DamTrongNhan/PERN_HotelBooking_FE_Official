import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import {
    Box,
    Unstable_Grid2 as Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    styled,
    Card,
    CardHeader,
    Collapse,
    Paper,
    Chip,
    Typography,
} from '@mui/material';
import {
    Cancel,
    LocalAtm,
    Groups,
    WatchLater,
    ExpandMore,
    QueryBuilder,
    MeetingRoom,
    SquareFoot,
    KingBed,
    TimesOneMobiledata,
} from '@mui/icons-material';

import { Image } from 'antd';

import { FormattedMessage } from 'react-intl';

import * as DOMPurify from 'dompurify';
import dayjs from 'dayjs';

import _ from 'lodash';

import HeaderComponent from 'components/dashboard/HeaderComponent';

import { LANGUAGES, formatCurrencyVND, formatCurrencyUSD } from 'utils';

const DialogViewRoomType = props => {
    const { openDialogView, handleToggleDialogView, currentRoomType = {} } = props;

    const language = useSelector(state => state.app.language || 'vi');

    const ListItem = styled('li')(({ theme }) => ({
        margin: theme.spacing(0.5),
    }));

    const [mainDetail, setMainDetail] = useState([]);

    const [photos, setPhotos] = useState([]);

    const [featuresVi, setFeaturesVi] = useState(null);
    const [featuresEn, setFeaturesEn] = useState(null);

    const [descriptionVi, setDescriptionVi] = useState(null);
    const [descriptionEn, setDescriptionEn] = useState(null);

    const [allAmenities, setAllAmenities] = useState([]);

    useEffect(() => {
        if (openDialogView && !_.isEmpty(currentRoomType)) {
            const roomType =
                language === LANGUAGES.VI
                    ? currentRoomType?.roomTypeDataRoomTypes?.valueVi
                    : currentRoomType?.roomTypeDataRoomTypes?.valueEn;
            const bedType =
                language === LANGUAGES.VI
                    ? currentRoomType?.bedTypeData?.valueVi
                    : currentRoomType?.bedTypeData?.valueEn;

            const pricePerNight =
                language === LANGUAGES.VI
                    ? formatCurrencyVND(currentRoomType?.pricePerNight)
                    : formatCurrencyUSD(currentRoomType?.pricePerNight);

            const createTime = dayjs(currentRoomType?.createdAt).format('DD/MM/YYYY');

            const mainDetail = [
                {
                    icon: <MeetingRoom fontSize="large" />,
                    content: roomType,
                    subtitle: <FormattedMessage id="dashboardAdmin.roomTypes.detail.roomType" />,
                },
                {
                    icon: <KingBed fontSize="large" />,
                    content: bedType,
                    subtitle: <FormattedMessage id="dashboardAdmin.roomTypes.detail.bedType" />,
                },
                {
                    icon: <Groups fontSize="large" />,
                    content: currentRoomType?.occupancy,
                    subtitle: <FormattedMessage id="dashboardAdmin.roomTypes.detail.occupancy" />,
                },
                {
                    icon: <SquareFoot fontSize="large" />,
                    content: currentRoomType?.size,
                    subtitle: <FormattedMessage id="dashboardAdmin.roomTypes.detail.size" />,
                },
                {
                    icon: <LocalAtm fontSize="large" />,
                    content: pricePerNight,
                    subtitle: <FormattedMessage id="dashboardAdmin.roomTypes.detail.pricePerNight" />,
                },
                {
                    icon: <QueryBuilder fontSize="large" />,
                    content: currentRoomType?.checkInOutTime,
                    subtitle: <FormattedMessage id="dashboardAdmin.roomTypes.detail.checkInOutTime" />,
                },
                {
                    icon: <TimesOneMobiledata fontSize="large" />,
                    content: currentRoomType?.numberBookings,
                    subtitle: <FormattedMessage id="dashboardAdmin.roomTypes.detail.numberBookings" />,
                },
                {
                    icon: <WatchLater fontSize="large" />,
                    content: createTime,
                    subtitle: <FormattedMessage id="dashboardAdmin.roomTypes.detail.createdAt" />,
                },
            ];
            setAllAmenities(currentRoomType?.amenitiesData);

            setPhotos(currentRoomType?.photosDataRoomTypes);

            setFeaturesVi(DOMPurify.sanitize(currentRoomType?.featuresVi));
            setFeaturesEn(DOMPurify.sanitize(currentRoomType?.featuresEn));

            setDescriptionVi(DOMPurify.sanitize(currentRoomType?.descriptionVi));
            setDescriptionEn(DOMPurify.sanitize(currentRoomType?.descriptionEn));

            setMainDetail(mainDetail);
        }
    }, [currentRoomType, openDialogView, language]);

    const [expanded, setExpanded] = useState(false);
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };
    const ExpandMoreComponent = styled(props => {
        const { expand, ...other } = props;
        return <IconButton {...other} />;
    })(({ theme, expand }) => ({
        transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
        margin: '0 auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    }));

    return (
        <>
            {openDialogView && (
                <Dialog
                    fullWidth
                    maxWidth="lg"
                    PaperProps={{
                        style: {
                            width: '80%',
                        },
                    }}
                    open={openDialogView}
                    onClose={handleToggleDialogView}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle
                        id="form-dialog-title"
                        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
                    >
                        <HeaderComponent
                            title={<FormattedMessage id="dashboardAdmin.roomTypes.title" />}
                            subtitle={<FormattedMessage id="dashboardAdmin.roomTypes.viewSubtitle" />}
                        />
                        <IconButton onClick={() => handleToggleDialogView()} size="large">
                            <Cancel fontSize="inherit" />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        <Card>
                            <Grid container spacing={2} p={2}>
                                <Grid xs={12} lg={12} container spacing={1}>
                                    {photos &&
                                        photos.map((item, index) => (
                                            <Grid key={index} xs={6} lg={3}>
                                                <Image src={item?.url} alt={item.type} />
                                            </Grid>
                                        ))}
                                </Grid>

                                <Grid xs={12} lg={12}>
                                    {mainDetail &&
                                        mainDetail.map((item, index) => {
                                            return (
                                                <CardHeader
                                                    key={index}
                                                    avatar={item.icon}
                                                    title={item.content}
                                                    subheader={item.subtitle}
                                                />
                                            );
                                        })}

                                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                                        <Box mb={2}>
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
                                                {allAmenities &&
                                                    allAmenities.map((data, index) => {
                                                        return (
                                                            <ListItem key={index}>
                                                                <Chip
                                                                    label={
                                                                        language === LANGUAGES.VI
                                                                            ? data.amenitiesTypeData.valueVi
                                                                            : data.amenitiesTypeData.valueEn
                                                                    }
                                                                />
                                                            </ListItem>
                                                        );
                                                    })}
                                            </Paper>
                                        </Box>
                                        <Typography sx={{ color: 'grey' }}>
                                            <FormattedMessage id="dashboardAdmin.roomTypes.detail.featuresVi" />
                                        </Typography>
                                        <div dangerouslySetInnerHTML={{ __html: featuresVi }} />
                                        <Typography sx={{ color: 'grey' }}>
                                            <FormattedMessage id="dashboardAdmin.roomTypes.detail.featuresEn" />
                                        </Typography>
                                        <div dangerouslySetInnerHTML={{ __html: featuresEn }} />

                                        <Typography sx={{ color: 'grey' }}>
                                            <FormattedMessage id="dashboardAdmin.roomTypes.detail.descriptionVi" />
                                        </Typography>
                                        <div dangerouslySetInnerHTML={{ __html: descriptionVi }} />
                                        <Typography sx={{ color: 'grey' }}>
                                            <FormattedMessage id="dashboardAdmin.roomTypes.detail.descriptionEn" />
                                        </Typography>
                                        <div dangerouslySetInnerHTML={{ __html: descriptionEn }} />
                                    </Collapse>

                                    <ExpandMoreComponent
                                        expand={expanded}
                                        onClick={handleExpandClick}
                                        aria-expanded={expanded}
                                        aria-label="show more"
                                    >
                                        <ExpandMore />
                                    </ExpandMoreComponent>
                                </Grid>
                            </Grid>
                        </Card>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
};

DialogViewRoomType.propTypes = {
    openDialogView: PropTypes.bool,
    handleToggleDialogView: PropTypes.func,
    currentRoomType: PropTypes.object,
};
export default DialogViewRoomType;
