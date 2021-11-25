import day from 'dayjs';
import lsTest from './lsTest';

export const session = {
    get() {
        return lsTest() ? sessionStorage.getItem('sessionId') : null;
    },
    set() {
        if (!lsTest()) return;
        sessionStorage.setItem('sessionId', day().valueOf());
    },
    reset() {
        if (!lsTest()) return;
        sessionStorage.removeItem('sessionId');
    },
    exists() {
        return !!this.get();
    },
};
