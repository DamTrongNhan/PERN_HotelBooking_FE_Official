import { createSlice } from '@reduxjs/toolkit';

export const bookingDataSlice = createSlice({
    name: 'bookingData',
    initialState: {
        checkIn: null,
        checkOut: null,
        adult: null,
        child: null,
        days: null,
    },
    reducers: {
        updateBookingData: (state, { payload }) => {
            state.checkIn = payload.checkIn;
            state.checkOut = payload.checkOut;
            state.adult = payload.adult;
            state.child = payload.child;
            state.days = payload.days;
        },
        deleteBookingData: (state, { payload }) => {
            state.checkIn = null;
            state.checkOut = null;
            state.adult = null;
            state.child = null;
            state.days = null;
        },
    },
});
export const { updateBookingData, deleteBookingData } = bookingDataSlice.actions;
export default bookingDataSlice.reducer;
