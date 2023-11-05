import { axiosPrivate } from 'config/axios';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import useRefreshToken from './useRefreshToken';
import { useSelector, useDispatch } from 'react-redux';
import { GUEST_PATHS } from 'utils';
import { removeUserInfo } from 'store/slice/authSlice';

const useAxiosPrivate = () => {
    const refresh = useRefreshToken();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { accessToken } = useSelector(state => state.auth);

    useEffect(() => {
        const requestIntercept = axiosPrivate.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${accessToken}`;
                }
                return config;
            },
            error => Promise.reject(error)
        );

        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response,
            async error => {
                const prevRequest = error?.config;
                if (error?.response?.status === 401 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    const newAccessToken = await refresh();
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axiosPrivate(prevRequest);
                } else if (error?.response?.status === 403) {
                    navigate(GUEST_PATHS.GUEST);
                    dispatch(removeUserInfo());
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accessToken, refresh]);
    // !!!! navigate and prevSent

    return axiosPrivate;
};

export default useAxiosPrivate;
