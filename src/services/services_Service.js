import { axiosPublic } from 'config/axios';

export const createService_Service = (axiosPrivate, data) => {
    return axiosPrivate.post('/services/createService', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
export const updateService_Service = (axiosPrivate, id, data) => {
    return axiosPrivate.put(`/services/updateService/${id}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
export const deleteService_Service = (axiosPrivate, id) => {
    return axiosPrivate.delete(`/services/deleteService/${id}`);
};
export const getAllServices_Service = () => {
    return axiosPublic.get('/services/getAllServices');
};

export const getAllServicesByType_Service = type => {
    return axiosPublic.get(`/services/getAllServicesByType/${type}`);
};

export const getService_Service = id => {
    return axiosPublic.get(`/services/getService/${id}`);
};
