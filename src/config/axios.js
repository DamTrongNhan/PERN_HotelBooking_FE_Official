import axios from 'axios';
const axiosPublic = axios.create({
    baseURL: process.env.REACT_APP_SERVER_API_URL,
});

axiosPublic.interceptors.response.use(
    response => {
        return response.data;
    },
    function (error) {
        return Promise.reject(error);
    }
);
const axiosPrivate = axios.create({
    baseURL: process.env.REACT_APP_SERVER_API_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
});

export { axiosPublic, axiosPrivate };
