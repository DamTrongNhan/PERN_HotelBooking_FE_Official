export const createBookingService = (axiosPrivate, data) => {
    return axiosPrivate.post('/bookings/createBooking', data);
};
export const updateBookingStatusService = (axiosPrivate, id, data) => {
    return axiosPrivate.put(`bookings/updateBookingStatus/${id}`, data);
};

export const getAllBookingsService = axiosPrivate => {
    return axiosPrivate.get('/bookings/getAllBookings');
};

export const getAllBookingHistoriesService = axiosPrivate => {
    return axiosPrivate.get('/bookings/getAllBookingHistories');
};

export const getBookingService = (axiosPrivate, id) => {
    return axiosPrivate.get(`/bookings/getBooking/${id}`);
};

export const verifyBookingService = (axiosPrivate, data) => {
    return axiosPrivate.put(`/bookings/verifyBooking`, data);
};
