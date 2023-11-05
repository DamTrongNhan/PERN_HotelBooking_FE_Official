import { axiosPublic } from 'config/axios';
import { useDispatch, useSelector } from 'react-redux';
import { updateAccessToken, updateRefreshToken } from 'store/slice/authSlice';
const useRefreshToken = () => {
    const dispatch = useDispatch();
    const refreshToken = useSelector(state => state.auth.refreshToken);
    const refresh = async () => {
        const response = await axiosPublic.post('/auth/refreshToken', { refreshToken });
        dispatch(updateAccessToken(response.accessToken));
        dispatch(updateRefreshToken(response.refreshToken));
        return response.accessToken;
    };
    return refresh;
};

export default useRefreshToken;
