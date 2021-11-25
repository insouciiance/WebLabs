import lsTest from './lsTest';

export const credentials = {
    get() {
        if (!lsTest()) return null;
        const username = localStorage.getItem('username');

        if (username) {
            return {
                username,
            };
        }

        return null;
    },
    set(username) {
        if (!lsTest()) return;
        localStorage.setItem('username', username);
    },
    reset() {
        if (!lsTest()) return;
        localStorage.removeItem('username');
    },
    exists() {
        return !!this.get();
    },
};
