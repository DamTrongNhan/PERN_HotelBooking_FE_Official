export const createBookingWithVnpayService = (axiosPrivate, data) => {
    return axiosPrivate.post('/bookingsVnpay/createBookingWithVnpay', data);
};
export const checkBookingStatusService = (axiosPrivate, bookingCode) => {
    return axiosPrivate.get(`/bookingsVnpay/checkBookingStatus/${bookingCode}`);
};
