import moment from 'moment';

export const authToken = {
    get() {
        const token = localStorage.getItem('token');
        const expires = localStorage.getItem('expires');

        if (token && expires) {
            return {
                token,
                expires,
            };
        }

        return null;
    },
    set(token, expires) {
        localStorage.setItem('token', token);
        localStorage.setItem('expires', expires);
    },
    reset() {
        localStorage.removeItem('token');
        localStorage.removeItem('exists');
    },
    exists() {
        return !!this.get();
    },
    valid() {
        if (!this.exists()) {
            return false;
        }

        const expiryDate = localStorage.getItem('expires');
        return moment(expiryDate) > moment();
    },
};
