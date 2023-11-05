import { axiosPublic } from 'config/axios';

export const createRoomTypeService = (axiosPrivate, data) => {
    return axiosPrivate.post(`/roomTypes/createRoomType`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
export const updateRoomTypeService = (axiosPrivate, id, data) => {
    return axiosPrivate.put(`/roomTypes/updateRoomType/${id}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
export const deleteRoomTypeService = (axiosPrivate, id) => {
    return axiosPrivate.delete(`/roomTypes/deleteRoomType/${id}`);
};
export const getAllRoomTypesService = () => {
    return axiosPublic.get('/roomTypes/getAllRoomTypes');
};
export const getRoomTypeService = id => {
    return axiosPublic.get(`/roomTypes/getRoomType/${id}`);
};

export const getAllRoomTypesByRoomTypeKeyService = roomTypeKey => {
    return axiosPublic.get(`/roomTypes/getAllRoomTypesByRoomTypeKey/${roomTypeKey}`);
};

export const getAllRoomTypesWithPaginationService = (page, size) => {
    return axiosPublic.get(`/roomTypes/getAllRoomTypesWithPagination/?page=${page}&size=${size}`);
};

export const getAllGalleryService = (page, size) => {
    return axiosPublic.get(`/roomTypes/getAllGallery/?page=${page}&size=${size}`);
};
