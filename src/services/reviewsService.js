import { axiosPublic } from 'config/axios';
export const createReviewService = (axiosPrivate, data) => {
    return axiosPrivate.post('/reviews/createReview', data);
};
export const updateReviewService = (axiosPrivate, id, data) => {
    return axiosPrivate.put(`/reviews/updateReview/${id}`, data);
};
export const deleteReviewService = (axiosPrivate, id) => {
    return axiosPrivate.delete(`/reviews/deleteReview/${id}`);
};
export const getReviewService = (axiosPrivate, id) => {
    return axiosPrivate.get(`/reviews/getReview/${id}`);
};
export const getAllReviewsService = () => {
    return axiosPublic.get('/reviews/getAllReviews');
};
export const getAllReviewsByRoomTypeIdWithPaginationService = (page, size, roomTypeId) => {
    return axiosPublic.get(
        `/reviews/getAllReviewsByRoomTypeIdWithPagination/?page=${page}&size=${size}&roomTypeId=${roomTypeId}`
    );
};
