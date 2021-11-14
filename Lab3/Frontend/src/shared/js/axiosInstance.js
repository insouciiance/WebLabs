import axios from 'axios';
import { authToken } from './authToken';
import { baseURL } from './config';
import { session } from './session';

const axiosInstance = axios.create({
    baseURL,
});

axiosInstance.interceptors.request.use(req => {
    const token = authToken.get();
    const sessionId = session.get();
    req.headers.authorization = `Bearer ${token?.token}`;
    req.headers.sessionId = sessionId;

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

        return error.response;
    }

    const errors = [];

    if (response.status === 429) {
        errors.push({
            message: `Please wait until you can continue working...`,
        });
    } else {
        errors.push({
            message: `Error ${response.status}`,
        });
    }

    response.data = { errors };

    return response;
});

export default axiosInstance;
