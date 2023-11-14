import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import {
    Box,
    IconButton,
    Typography,
    Unstable_Grid2 as Grid,
    useTheme,
    Card,
    CardHeader,
    CardActions,
    Divider,
    CardContent,
} from '@mui/material';
import {
    People,
    SensorDoor,
    Hotel,
    ReceiptLong,
    RateReview,
    AccountBalanceWallet,
    Done,
    Clear,
} from '@mui/icons-material';

import { toast } from 'react-toastify';
import { FormattedMessage } from 'react-intl';

import LoadingOverlay from 'components/common/LoadingOverlay';
import OverView from 'components/dashboard/OverView';

import useAxiosPrivate from 'hooks/useAxiosPrivate';
import { getAllStatisticsService } from 'services/statisticsService';
import { LANGUAGES, formatCurrencyVND, formatCurrencyUSD } from 'utils';

const DashBoard = () => {
    const axiosPrivate = useAxiosPrivate();

    const language = useSelector(state => state.app.language || 'vi');

    const [isLoading, setIsLoading] = useState(false);

    const [allStatistics, setAllStatistics] = useState([]);

    const theme = useTheme();

    const dark = theme.palette.neutral.dark;
    const background = theme.palette.background.default;
    const neutralLight = theme.palette.neutral.light;
    const primaryLight = theme.palette.primary.light;
    const alt = theme.palette.background.alt;
    const medium = theme.palette.neutral.medium;
    const mediumMain = theme.palette.neutral.mediumMain;
    const main = theme.palette.neutral.main;
    const primary = theme.palette.primary.main;

    useEffect(() => {
        getAllStatistics();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getAllStatistics = async () => {
        try {
            setIsLoading(true);
            const response = await getAllStatisticsService(axiosPrivate);
            if (response?.data?.data) {
                const data = response.data.data;
                const allStatisticsData = [
                    { title: 'Users', value: data.users || 0, icon: <People />, color: 'secondary.main' },
                    { title: 'Room types', value: data.roomTypes || 0, icon: <Hotel />, color: 'info.main' },
                    { title: 'Rooms', value: data.rooms || 0, icon: <SensorDoor />, color: 'info.light' },
                    { title: 'Reviews', value: data.reviews || 0, icon: <RateReview />, color: 'secondary.light' },
                    { title: 'Bookings', value: data.bookings || 0, icon: <ReceiptLong />, color: 'primary.dark' },
                    {
                        title: 'Bookings completed',
                        value: data.bookingsCompleted || 0,
                        icon: <Done />,
                        color: 'success.light',
                    },
                    {
                        title: 'Bookings cancelled',
                        value: data.bookingsCancelled || 0,
                        icon: <Clear />,
                        color: 'error.main',
                    },
                    {
                        title: 'Total profit',
                        value: data.totalProfit || 0,
                        icon: <AccountBalanceWallet />,
                        color: 'warning.light',
                    },
                ];
                setAllStatistics(allStatisticsData);
                setIsLoading(false);
            } else {
                setIsLoading(false);
            }
        } catch (error) {
            setIsLoading(false);
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error(error.message);
            }
        }
    };

    return (
        <>
            <LoadingOverlay isLoading={isLoading} />
            <Box p={2} sx={{ flexGrow: 1 }}>
                <Grid container spacing={3} sx={{ overFlowX: 'auto' }}>
                    {allStatistics &&
                        allStatistics.map((statistic, index) => (
                            <Grid key={index} xs={12} sm={6} lg={3}>
                                <OverView
                                    sx={{ height: '100%' }}
                                    title={statistic?.title}
                                    value={
                                        statistic?.title === 'Total profit'
                                            ? language === LANGUAGES.VI
                                                ? formatCurrencyVND(statistic.value)
                                                : formatCurrencyUSD(statistic.value)
                                            : statistic?.value
                                    }
                                    icon={statistic?.icon}
                                    color={statistic?.color}
                                />
                            </Grid>
                        ))}

                    <Grid xs={12} lg={8}>
                        <Card>
                            <CardHeader action={''} title="Sales" />
                            <CardContent></CardContent>
                            <Divider />
                            <CardActions sx={{ justifyContent: 'flex-end' }}></CardActions>
                        </Card>
                    </Grid>
                    <Grid xs={12} md={6} lg={4}>
                        <Card>
                            <CardHeader title="Traffic Source" />
                            <CardContent></CardContent>
                        </Card>
                    </Grid>
                    <Grid xs={12} md={6} lg={4}>
                        <Card>
                            <CardHeader title="Latest Products" />

                            <Divider />
                            <CardActions sx={{ justifyContent: 'flex-end' }}></CardActions>
                        </Card>
                    </Grid>
                    <Grid xs={12} md={12} lg={8}>
                        <Card>
                            <CardHeader title="Latest Orders" />
                            <Box sx={{ minWidth: 800 }}></Box>
                            <Divider />
                            <CardActions sx={{ justifyContent: 'flex-end' }}></CardActions>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};
export default DashBoard;
