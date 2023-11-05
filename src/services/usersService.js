export const createUserService = (axiosPrivate, data) => {
    return axiosPrivate.post(`/users/createUser`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
export const updateUserService = (axiosPrivate, id, data) => {
    return axiosPrivate.put(`/users/updateUser/${id}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const updatePasswordService = (axiosPrivate, id, data) => {
    return axiosPrivate.put(`/users/updatePassword/${id}`, data);
};
export const deleteUserService = (axiosPrivate, id) => {
    return axiosPrivate.delete(`/users/deleteUser/${id}`);
};
export const getUserService = (axiosPrivate, id) => {
    return axiosPrivate.get(`/users/getUser/${id}`);
};
export const getAllUsersService = axiosPrivate => {
    return axiosPrivate.get('/users/getAllUsers');
};

export const updateUserStatusService = (axiosPrivate, id, data) => {
    return axiosPrivate.put(`users/updateUserStatus/${id}`, data);
};
