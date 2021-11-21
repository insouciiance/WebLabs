import axios from 'axios';
import moment from 'moment';
import { authTokens } from './authTokens';
import { baseRESTURL } from './config';
import { session } from './session';

const axiosRESTInstance = axios.create({
    baseURL: baseRESTURL,
});

axiosRESTInstance.interceptors.request.use(req => {
    const token = authTokens.get();
    const sessionId = session.get();
    req.headers.authorization ??= `Bearer ${token?.authToken}`;
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

    if (status === 401) {
        const { refreshToken, expires } = authTokens.get();

        if (!authTokens.exists() || moment(expires).isBefore(moment())) {
            errors = [
                {
                    message: 'Authorization error.',
                },
            ];

            error.response = {
                data: { errors },
            };

            return Promise.reject(error);
        }

        authTokens.reset();

        return axiosRESTInstance
            .post('/auth/refresh', null, {
                headers: {
                    authorization: `Bearer ${refreshToken}`,
                },
            })
            .then(res => {
                authTokens.set(res.data, refreshToken, expires);

                return Promise.resolve(res);
            })
            .catch(error => {
                errors = [
                    {
                        message: 'Authorization error.',
                    },
                ];

                error.response = {
                    data: { errors },
                };

                return Promise.reject(error);
            });
    }

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
