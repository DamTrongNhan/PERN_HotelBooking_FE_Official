import { useEffect, useState } from 'react';

import { Box, Typography, Unstable_Grid2 as Grid, useTheme, Paper } from '@mui/material';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

import { toast } from 'react-toastify';

import LoadingOverlay from 'components/common/LoadingOverlay';

import useAxiosPrivate from 'hooks/useAxiosPrivate';
import { getBookingsCalendarService } from 'services/statisticsService';

const Calendar = () => {
    const axiosPrivate = useAxiosPrivate();

    const [isLoading, setIsLoading] = useState(false);
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const getBookingsCalendar = async () => {
            try {
                setIsLoading(true);
                const response = await getBookingsCalendarService(axiosPrivate);
                if (response?.data?.data) {
                    setBookings(response.data.data);
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

        getBookingsCalendar();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const eventSource = bookings?.map(booking => ({
        title: booking?.email,
        start: booking?.checkIn,
        end: booking?.checkOut,
    }));

    return (
        <>
            <LoadingOverlay isLoading={isLoading} />
            <Box p={2} sx={{ flexGrow: 1 }}>
                <Paper sx={{ p: 2 }}>
                    <FullCalendar plugins={[dayGridPlugin]} initialView="dayGridMonth" events={eventSource} />
                </Paper>
            </Box>
        </>
    );
};

export default Calendar;
