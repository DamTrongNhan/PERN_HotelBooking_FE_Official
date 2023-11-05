import { axiosPublic } from 'config/axios';
export const createCodeService = (axiosPrivate, data) => {
    return axiosPrivate.post('/allCodes/createCode', data);
};
export const updateCodeService = (axiosPrivate, id, data) => {
    return axiosPrivate.put(`allCodes/updateCode/${id}`, data);
};
export const deleteCodeService = (axiosPrivate, id) => {
    return axiosPrivate.delete(`allCodes/deleteCode/${id}`);
};
export const getAllCodesService = (axiosPrivate) => {
    return axiosPrivate.get('/allCodes/getAllCodes');
};
export const getAllCodesByTypeService = (type) => {
    return axiosPublic.get(`/allCodes/getAllCodesByType/${type}`);
};

export const getCodeService = (id) => {
    return axiosPublic.get(`/allCodes/getCode/${id}`);
};
