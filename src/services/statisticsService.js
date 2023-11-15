export const getAllStatisticsService = axiosPrivate => {
    return axiosPrivate.get('/statistics/getAllStatistics');
};

export const getBookingsCalendarService = axiosPrivate => {
    return axiosPrivate.get('/statistics/getBookingsCalendar');
};
