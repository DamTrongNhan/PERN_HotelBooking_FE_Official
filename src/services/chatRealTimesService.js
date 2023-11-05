export const getAllMemberChatByAdminIdService = (axiosPrivate, adminId) => {
    return axiosPrivate.get(`/chatRealTimes/getAllMemberChatByAdminId/${adminId}`);
};
export const getMemberChatByCustomerIdService = (axiosPrivate, data) => {
    return axiosPrivate.post(`/chatRealTimes/getMemberChatByCustomerId`, data);
};

export const createContentChatService = (axiosPrivate, data) => {
    return axiosPrivate.post('/chatRealTimes/createContentChat', data);
};

export const getContentChatService = (axiosPrivate, memberChatId) => {
    return axiosPrivate.get(`/chatRealTimes/getContentChat/${memberChatId}`);
};

export const getAllUsersSearchService = (axiosPrivate, search) => {
    return axiosPrivate.get(`/chatRealTimes/getAllUsers?search=${search}`);
};
