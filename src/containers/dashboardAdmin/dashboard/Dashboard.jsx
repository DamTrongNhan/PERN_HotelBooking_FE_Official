import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { Box, Typography, Unstable_Grid2 as Grid, useTheme, Paper } from '@mui/material';
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

import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip, Legend } from 'recharts';

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
    const [revenue, setRevenue] = useState([]);

    const theme = useTheme();

    // const dark = theme.palette.neutral.dark;
    // const background = theme.palette.background.default;
    // const neutralLight = theme.palette.neutral.light;
    // const primaryLight = theme.palette.primary.light;
    // const alt = theme.palette.background.alt;
    // const medium = theme.palette.neutral.medium;
    // const mediumMain = theme.palette.neutral.mediumMain;
    // const main = theme.palette.neutral.main;
    // const primary = theme.palette.primary.main;

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
                setRevenue(data?.revenue);
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

                    <Grid xs={12} lg={12}>
                        <Paper
                            sx={{
                                p: 2,
                                display: 'flex',
                                alignItems: 'center',
                                flexDirection: 'column',
                                height: 500,
                            }}
                        >
                            <Typography component="h2" variant="h5" color="primary" gutterBottom>
                                <FormattedMessage id="dashboardAdmin.dashboard.revenue" />
                            </Typography>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={revenue}
                                    margin={{
                                        top: 16,
                                        right: 16,
                                        bottom: 0,
                                        left: 24,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="date"
                                        stroke={theme.palette.text.secondary}
                                        style={theme.typography.body2}
                                    />
                                    <YAxis stroke={theme.palette.text.secondary} style={theme.typography.body2}></YAxis>
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="profit" stroke={theme.palette.primary.main} />
                                </LineChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>

                    {/* <Grid xs={12} md={6} lg={4}>
                        <Paper
                            sx={{
                                p: 2,
                                display: 'flex',
                                alignItems: 'center',
                                flexDirection: 'column',
                                height: 270,
                            }}
                        >
                            <Typography component="h2" variant="h5" color="primary" gutterBottom>
                                Room types
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid xs={12} md={12} lg={8}>
                        <Paper
                            sx={{
                                p: 2,
                                display: 'flex',
                                alignItems: 'center',
                                flexDirection: 'column',
                                height: 270,
                            }}
                        >
                            <Typography component="h2" variant="h6" color="primary" gutterBottom>
                                Most room type
                            </Typography>
                        </Paper>
                    </Grid> */}
                </Grid>
            </Box>
        </>
    );
};
export default DashBoard;
