export const getAllMemberChatService = axiosPrivate => {
    return axiosPrivate.get(`/chatRealTimes/getAllMemberChat`);
};
export const getMemberChatService = (axiosPrivate, data) => {
    return axiosPrivate.post(`/chatRealTimes/getMemberChat`, data);
};

export const getMemberChatAdminService = axiosPrivate => {
    return axiosPrivate.get(`/chatRealTimes/getMemberChatAdmin`);
};

export const createContentChatService = (axiosPrivate, data) => {
    return axiosPrivate.post('/chatRealTimes/createContentChat', data);
};

export const getAllContentChatService = (axiosPrivate, memberChatId) => {
    return axiosPrivate.get(`/chatRealTimes/getAllContentChat/${memberChatId}`);
};

export const getAllUsersSearchService = (axiosPrivate, search) => {
    return axiosPrivate.get(`/chatRealTimes/getAllUsers?search=${search}`);
};
