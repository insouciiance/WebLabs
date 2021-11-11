export const credentials = {
    get() {
        const username = localStorage.getItem('username');

        if (username) {
            return {
                username,
            };
        }

        return null;
    },
    set(username) {
        localStorage.setItem('username', username);
    },
    reset() {
        localStorage.removeItem('username');
    },
    exists() {
        return !!this.get();
    },
};
