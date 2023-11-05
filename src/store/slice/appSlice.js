import { createSlice } from '@reduxjs/toolkit';

export const appSlice = createSlice({
    name: 'app',
    initialState: {
        language: 'vi',
        mode: 'light'
    },
    reducers: {
        changeLanguage: (state, { payload }) => {
            state.language = payload;
        },
        changeMode: (state, { payload }) => {
            state.mode = state.mode === 'light' ? 'dark' : 'light';
        }
    }
});
export const { changeLanguage, changeMode } = appSlice.actions;
export default appSlice.reducer;
