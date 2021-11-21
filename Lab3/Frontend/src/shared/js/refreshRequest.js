import { authTokens } from './authTokens';
import axiosRESTInstance from './axiosRESTInstance';

const refreshPromise = null;

const refreshRequest = {
    isPending: !!refreshPromise,
    send() {
        if (this.isPending) {
            return refreshPromise;
        }

        this.isPending = true;

        const { refreshToken } = authTokens.get();
        authTokens.reset();

        return axiosRESTInstance
            .post('/auth/refresh', null, {
                headers: {
                    authorization: `Bearer ${refreshToken}`,
                },
            })
            .then(res => {
                const { authToken, expires } = res.data;
                authTokens.set(authToken, refreshToken, expires);
                this.isPending = false;
                return Promise.resolve(res);
            })
            .catch(error => {
                this.isPending = false;
                return Promise.reject(error);
            });
    },
};

export default refreshRequest;
