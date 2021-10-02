import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://localhost:44390/api/',
});

axiosInstance.interceptors.response.use(null, error => {
    if (error.response.status === 429) {
        const errors = {
            CallQuotaExceeded: error.response.data,
        };
        error.response.data = { errors };
    }
    return Promise.reject(error);
});

export default axiosInstance;
