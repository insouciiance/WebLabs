import moment from 'moment';

export const session = {
    get() {
        return sessionStorage.getItem('sessionId');
    },
    set() {
        sessionStorage.setItem('sessionId', moment().valueOf());
    },
    reset() {
        sessionStorage.removeItem('sessionId');
    },
    exists() {
        return !!this.get();
    },
};
