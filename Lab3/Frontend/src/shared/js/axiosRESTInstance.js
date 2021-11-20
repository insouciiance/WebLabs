import axios from 'axios';
import { authToken } from './authToken';
import { baseRESTURL } from './config';
import { session } from './session';

const axiosRESTInstance = axios.create({
    baseURL: baseRESTURL,
});

axiosRESTInstance.interceptors.request.use(req => {
    const token = authToken.get();
    const sessionId = session.get();
    req.headers.authorization = `Bearer ${token?.token}`;
    req.headers.sessionId = sessionId;

    return req;
});

axiosRESTInstance.interceptors.response.use(null, error => {
    let errors = null;

    if (!error.response) {
        errors = [
            {
                message: 'Unexpected network error',
            },
        ];

        error.response = {
            data: { errors },
        };
        return Promise.reject(error);
    }

    const { status } = error.response;

    if (status === 400) {
        const validationErrors = error.response.data.errors;
        errors = [];

        for (const value of validationErrors) {
            errors.push({
                message: value,
            });
        }
    }

    if (status === 429) {
        errors = [
            {
                message: `Please wait until you can continue working...`,
            },
        ];
    }

    errors ??= [
        {
            message: `Error ${status}`,
        },
    ];

    error.response = {
        data: { errors },
    };

    return Promise.reject(error);
});

export default axiosRESTInstance;
