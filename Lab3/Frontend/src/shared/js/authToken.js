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
    exists() {
        return !!this.get();
    },
};
