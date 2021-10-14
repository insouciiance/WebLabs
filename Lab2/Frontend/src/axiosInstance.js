import axios from 'axios';

const baseURL =
    process.env.NODE_ENV.toLowerCase() === 'development'
        ? 'https://localhost:44390/api'
        : 'https://insouciiance-mail.azurewebsites.net/api';

const axiosInstance = axios.create({
    baseURL,
});

axiosInstance.interceptors.response.use(null, error => {
    if (!error.response) {
        const errors = {
            NetworkError: ['Error: Network error'],
        };
        error.response = {
            data: { errors },
        };
    }

    if (error.response.status === 429) {
        const errors = {
            CallQuotaExceeded: [error.response.data],
        };
        error.response.data = { errors };
    }

    return Promise.reject(error);
});

export default axiosInstance;
