import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { Box, IconButton, Typography, Unstable_Grid2 as Grid, useTheme } from '@mui/material';
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
                </Grid>

                {/* ROW 2 */}
                {/* <Box gridColumn="span 8" gridRow="span 2" backgroundColor={neutralLight}>
                            <Box
                                mt="25px"
                                p="0 30px"
                                display="flex "
                                justifyContent="space-between"
                                alignItems="center"
                            >
                                <Box>
                                    <Typography variant="h5" fontWeight="600" color={colors.grey[100]}>
                                        Revenue Generated
                                    </Typography>
                                    <Typography variant="h3" fontWeight="bold" color={colors.greenAccent[500]}>
                                        $59,342.32
                                    </Typography>
                                </Box>
                                <Box>
                                    <IconButton>
                                        <DownloadOutlinedIcon
                                            sx={{ fontSize: '26px', color: colors.greenAccent[500] }}
                                        />
                                    </IconButton>
                                </Box>
                            </Box>
                            <Box height="250px" m="-20px 0 0 0">
                                <LineChart isDashboard={true} />
                            </Box>
                        </Box>
                        <Box gridColumn="span 4" gridRow="span 2" backgroundColor={neutralLight} overflow="auto">
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                borderBottom={`4px solid ${colors.primary[500]}`}
                                colors={colors.grey[100]}
                                p="15px"
                            >
                                <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
                                    Recent Transactions
                                </Typography>
                            </Box>
                            {mockTransactions.map((transaction, i) => (
                                <Box
                                    key={`${transaction.txId}-${i}`}
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    borderBottom={`4px solid ${colors.primary[500]}`}
                                    p="15px"
                                >
                                    <Box>
                                        <Typography color={colors.greenAccent[500]} variant="h5" fontWeight="600">
                                            {transaction.txId}
                                        </Typography>
                                        <Typography color={colors.grey[100]}>{transaction.user}</Typography>
                                    </Box>
                                    <Box color={colors.grey[100]}>{transaction.date}</Box>
                                    <Box backgroundColor={colors.greenAccent[500]} p="5px 10px" borderRadius="4px">
                                        ${transaction.cost}
                                    </Box>
                                </Box>
                            ))}
                        </Box> */}

                {/* ROW 3 */}
                {/* <Box gridColumn="span 4" gridRow="span 2" backgroundColor={neutralLight} p="30px">
                            <Typography variant="h5" fontWeight="600">
                                Campaign
                            </Typography>
                            <Box display="flex" flexDirection="column" alignItems="center" mt="25px">
                                <ProgressCircle size="125" />
                                <Typography variant="h5" color={colors.greenAccent[500]} sx={{ mt: '15px' }}>
                                    $48,352 revenue generated
                                </Typography>
                                <Typography>Includes extra misc expenditures and costs</Typography>
                            </Box>
                        </Box>
                        <Box gridColumn="span 4" gridRow="span 2" backgroundColor={neutralLight}>
                            <Typography variant="h5" fontWeight="600" sx={{ padding: '30px 30px 0 30px' }}>
                                Sales Quantity
                            </Typography>
                            <Box height="250px" mt="-20px">
                                <BarChart isDashboard={true} />
                            </Box>
                        </Box>
                        <Box gridColumn="span 4" gridRow="span 2" backgroundColor={neutralLight} padding="30px">
                            <Typography variant="h5" fontWeight="600" sx={{ marginBottom: '15px' }}>
                                Geography Based Traffic
                            </Typography>
                            <Box height="200px">
                                <GeographyChart isDashboard={true} />
                            </Box>
                        </Box> */}
            </Box>
        </>
    );
};
export default DashBoard;
