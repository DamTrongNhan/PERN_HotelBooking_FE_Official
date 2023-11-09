import { axiosPublic } from 'config/axios';
export const createReviewService = (axiosPrivate, data) => {
    return axiosPrivate.post('/reviews/createReview', data);
};
export const updateReviewService = (axiosPrivate, reviewId, data) => {
    return axiosPrivate.put(`/reviews/updateReview/${reviewId}`, data);
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
export const getAllReviewsByUserIdService = (axiosPrivate, userId) => {
    return axiosPrivate.get(`/reviews/getAllReviewsByUserId/${userId}`);
};
