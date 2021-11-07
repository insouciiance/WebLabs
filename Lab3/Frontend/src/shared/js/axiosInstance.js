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

axiosInstance.interceptors.response.use(null, error => {
    const { response } = error;

    if (!response) {
        const errors = [
            {
                message: 'Unexpected network error',
            },
        ];

        error.response = {
            data: { errors },
        };

        return Promise.reject(error);
    }

    const errors = [
        {
            message: `Error ${response.status}`,
        },
    ];

    response.data.errors = errors;

    return Promise.reject(error);
});

export default axiosInstance;
