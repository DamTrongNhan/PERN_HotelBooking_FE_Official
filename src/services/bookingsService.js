export const createBookingService = (axiosPrivate, data) => {
    return axiosPrivate.post('/bookings/createBooking', data);
};
export const updateBookingStatusService = (axiosPrivate, id, data) => {
    return axiosPrivate.put(`bookings/updateBookingStatus/${id}`, data);
};

export const verifyBookingService = (axiosPrivate, data) => {
    return axiosPrivate.put(`/bookings/verifyBooking`, data);
};

// return array -> admin

export const getAllBookingsService = axiosPrivate => {
    return axiosPrivate.get('/bookings/getAllBookings');
};

export const getAllBookingHistoriesService = (axiosPrivate, type) => {
    return axiosPrivate.get(`/bookings/getAllBookingHistories/?type=${type}`);
};

// return array -> user

export const getAllBookingsByUserIdService = (axiosPrivate, userId) => {
    return axiosPrivate.get(`/bookings/getAllBookingsByUserId/${userId}`);
};

export const getAllBookingHistoriesByUserIdService = (axiosPrivate, userId, type) => {
    return axiosPrivate.get(`/bookings/getAllBookingHistoriesByUserId/?userId=${userId}&type=${type}`);
};

// return object

export const getBookingService = (axiosPrivate, id) => {
    return axiosPrivate.get(`/bookings/getBooking/${id}`);
};

export const getBookingByBookingCodeService = (axiosPrivate, bookingCode) => {
    return axiosPrivate.get(`/bookings/getBookingByBookingCode/${bookingCode}`);
};
