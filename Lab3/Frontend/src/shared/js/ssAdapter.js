import lsTest from './lsTest';

const ssAdapter = {
    get(key) {
        if (!lsTest()) return null;

        return sessionStorage.getItem(key);
    },

    set(key, value) {
        if (!lsTest()) return;

        sessionStorage.setItem(key, value);
    },

    remove(key) {
        if (!lsTest()) return;

        sessionStorage.removeItem(key);
    },
};

export default ssAdapter;
