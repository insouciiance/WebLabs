import axios from 'axios';

const baseURL =
    process.env.NODE_ENV.toLowerCase() === 'development'
        ? 'https://localhost:5001/graphql'
        : null;

const axiosInstance = axios.create({
    baseURL,
});

axiosInstance.interceptors.request.use(req => {
    req.headers.authorization = `Bearer ${localStorage.getItem('token')}`;

    return req;
});

export default axiosInstance;
