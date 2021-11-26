import lsAdapter from './lsAdapter';

export const credentials = {
    get() {
        const username = lsAdapter.get('username');

        if (username) {
            return {
                username,
            };
        }

        return null;
    },
    set(username) {
        lsAdapter.set('username', username);
    },
    reset() {
        lsAdapter.remove('username');
    },
    exists() {
        return !!this.get();
    },
};
