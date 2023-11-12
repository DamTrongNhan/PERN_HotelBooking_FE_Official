export const getAllStatisticsService = axiosPrivate => {
    return axiosPrivate.get('/statistics/getAllStatistics');
};
