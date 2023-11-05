import { createSlice } from '@reduxjs/toolkit';

export const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        selectedChat: null,
        notifications: [],
        chats: null,
    },
    reducers: {
        updateSelectedChat: (state, { payload }) => {
            state.selectedChat = payload;
        },
        updateNotifications: (state, { payload }) => {
            state.notifications = payload;
        },
        updateChats: (state, { payload }) => {
            state.chats = payload;
        },
        removeChatState: (state, { payload }) => {
            state.selectedChat = null;
            state.notifications = [];
            state.chats = null;
        },
    },
});
export const { updateSelectedChat, updateNotifications, updateChats, removeChatState } = chatSlice.actions;
export default chatSlice.reducer;
