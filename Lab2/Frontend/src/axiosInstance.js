import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://insouciiance-mail.azurewebsites.net/api',
    // baseURL: 'https://localhost:44390/api',
});

axiosInstance.interceptors.response.use(null, error => {
    if (!error.response) {
        const errors = {
            NetworkError: 'Error: Network error',
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
