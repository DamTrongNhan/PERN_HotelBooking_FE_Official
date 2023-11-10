export const createBookingWithVnpayService = (axiosPrivate, data) => {
    return axiosPrivate.post('/bookingsVnpay/createBookingWithVnpay', data);
};

export const repaymentService = (axiosPrivate, data) => {
    return axiosPrivate.post('/bookingsVnpay/repayment', data);
};
