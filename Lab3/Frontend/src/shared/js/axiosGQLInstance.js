import axios from 'axios';
import { authTokens } from './authTokens';
import { baseGQLURL } from './config';
import { session } from './session';
import day from 'dayjs';
import refreshRequest from './refreshRequest';

const axiosGQLInstance = axios.create({
    baseURL: baseGQLURL,
});

axiosGQLInstance.interceptors.request.use(req => {
    const token = authTokens.get();
    const sessionId = session.get();
    req.headers.authorization ??= `Bearer ${token?.authToken}`;
    req.headers.sessionId = sessionId;

    return req;
});

axiosGQLInstance.interceptors.response.use(
    response => {
        const { data } = response;

        let errors = null;

        if (
            !data.errors ||
            data.errors[0].extensions?.code !== 'AUTH_NOT_AUTHENTICATED'
        ) {
            return Promise.resolve(response);
        }

        if (
            !authTokens.exists() ||
            day(authTokens.get().expires).isBefore(day())
        ) {
            errors = [
                {
                    message: 'Authorization error.',
                },
            ];

            response.data.errors = errors;

            return Promise.resolve(response);
        }

        return refreshRequest
            .send()
            .then(() => {
                const { authToken } = authTokens.get();
                response.config.headers['authorization'] =
                    'Bearer ' + authToken;
                return Promise.resolve(
                    axiosGQLInstance.request(response.config),
                );
            })
            .catch(() => {
                errors = [
                    {
                        message: 'Authorization error.',
                    },
                ];

                response.data.errors = errors;

                return Promise.resolve(response);
            });
    },
    error => {
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
    },
);

export default axiosGQLInstance;
