import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { signInService, signUpService } from 'services/authServices';
import { GUEST_PATHS, AUTH_PATHS } from 'utils';

export const signUp = createAsyncThunk('auth/signUp', async ({ values, navigate }, { rejectWithValue }) => {
    try {
        const res = await signUpService(values);
        navigate(AUTH_PATHS.SIGN_IN);
        return res;
    } catch (err) {
        return rejectWithValue(err);
    }
});

export const signIn = createAsyncThunk(
    'auth/signIn',
    async ({ values, navigate }, { rejectWithValue, dispatch, getState }) => {
        try {
            const res = await signInService(values);
            // if (res.data.roleKey === 'R1') navigate(DASHBOARD_ADMIN_PATHS.DASHBOARD);
            // else if (res.data.roleKey === 'R2') navigate(DASHBOARD_USER_PATHS.DASHBOARD);
            // else {
            //     throw new Error('Unauthorized');
            // }
            navigate(GUEST_PATHS.GUEST);
            return res;
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        userInfo: null,
        accessToken: null,
        refreshToken: null,
        isLoggedIn: false,
        OTP: false,
        resetPasswordToken: null,
    },
    reducers: {
        saveUserInfo: (state, { payload }) => {
            state.userInfo = payload.data;
            state.accessToken = payload.accessToken;
            state.refreshToken = payload.refreshToken;
            state.isLoggedIn = true;
        },
        removeUserInfo: (state, { payload }) => {
            state.userInfo = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.isLoggedIn = false;
        },
        updateAccessToken: (state, { payload }) => {
            state.accessToken = payload;
        },
        updateRefreshToken: (state, { payload }) => {
            state.refreshToken = payload;
        },
        updateOTPRequest: (state, { payload }) => {
            state.OTP = true;
            state.resetPasswordToken = payload;
        },
        removeOTPRequest: (state, { payload }) => {
            state.OTP = false;
            state.resetPasswordToken = null;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(signIn.pending, (state, { payload }) => {})
            .addCase(signIn.fulfilled, (state, { payload }) => {
                state.userInfo = payload.data;
                state.accessToken = payload.accessToken;
                state.refreshToken = payload.refreshToken;
                state.isLoggedIn = true;
            })
            .addCase(signIn.rejected, (state, { payload }) => {
                state.userInfo = null;
                state.accessToken = null;
                state.refreshToken = null;
                state.isLoggedIn = false;
            })
            .addCase(signUp.pending, (state, { payload }) => {})
            .addCase(signUp.fulfilled, (state, { payload }) => {})
            .addCase(signUp.rejected, (state, { payload }) => {});
    },
});
export const {
    saveUserInfo,
    removeUserInfo,
    updateAccessToken,
    updateRefreshToken,
    updateOTPRequest,
    removeOTPRequest,
} = authSlice.actions;
export default authSlice.reducer;
