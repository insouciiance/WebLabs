import moment from 'moment';

export const authTokens = {
    get() {
        const authToken = localStorage.getItem('authToken');
        const refreshToken = localStorage.getItem('refreshToken');
        const expires = localStorage.getItem('expires');

        if (authToken && refreshToken && expires) {
            return {
                authToken,
                refreshToken,
                expires,
            };
        }

        return null;
    },
    set(authToken, refreshToken, expires) {
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('expires', expires);
    },
    reset() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('expires');
    },
    exists() {
        return !!this.get();
    },
    valid() {
        if (!this.exists()) {
            return false;
        }

        const expiryDate = localStorage.getItem('expires');
        return moment().isBefore(moment(expiryDate));
    },
};
