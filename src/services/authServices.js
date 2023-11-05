import { axiosPublic } from 'config/axios';

export const signInService = data => {
    return axiosPublic.post('/auth/signIn', data);
};
export const signUpService = data => {
    return axiosPublic.post('/auth/signUp', data);
};
export const signOutService = axiosPrivate => {
    return axiosPrivate.post('/auth/signOut');
};
export const forgotPaswordService = data => {
    return axiosPublic.post('/auth/forgotPassword', data);
};
export const forgotPasswordService = data => {
    return axiosPublic.post('/auth/forgotPassword', data);
};
export const verifyOTPService = data => {
    return axiosPublic.post('/auth/verifyOTP', data);
};
export const resetPasswordService = data => {
    return axiosPublic.post('/auth/resetPassword', data);
};
