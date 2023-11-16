import { useEffect, useState } from 'react';

import { Box, Paper } from '@mui/material';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

import { toast } from 'react-toastify';

import LoadingOverlay from 'components/common/LoadingOverlay';
import DialogViewBooking from 'containers/dashboardAdmin/bookings/DialogViewBooking';

import useAxiosPrivate from 'hooks/useAxiosPrivate';
import { getBookingsCalendarService } from 'services/statisticsService';

const Calendar = () => {
    const axiosPrivate = useAxiosPrivate();

    const [isLoading, setIsLoading] = useState(false);
    const [bookings, setBookings] = useState([]);
    const [currentBooking, setCurrentBooking] = useState(null);
    const [openDialogViewBooking, setOpenDialogViewBooking] = useState(false);

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
        id: booking.id,
        title: booking?.email,
        start: booking?.checkIn,
        end: booking?.checkOut,
    }));

    const viewBookingDetails = selected => {
        const booking = bookings.find(booking => booking.id === selected.event.id);
        setCurrentBooking(booking);
        handleToggleDialogViewBooking();
    };
    const handleToggleDialogViewBooking = () => {
        setOpenDialogViewBooking(!openDialogViewBooking);
    };

    return (
        <>
            <LoadingOverlay isLoading={isLoading} />
            <Box p={2} sx={{ flexGrow: 1 }}>
                <Paper sx={{ p: 2 }}>
                    <FullCalendar
                        plugins={[dayGridPlugin]}
                        initialView="dayGridMonth"
                        dayMaxEvents={true}
                        eventClick={viewBookingDetails}
                        events={eventSource}
                    />
                </Paper>
            </Box>
            <DialogViewBooking
                handleToggleDialogView={handleToggleDialogViewBooking}
                openDialogView={openDialogViewBooking}
                currentBooking={currentBooking}
            />
        </>
    );
};

export default Calendar;
