import day from 'dayjs';
import ssAdapter from './ssAdapter';

export const session = {
    get() {
        return ssAdapter.get('sessionId');
    },
    set() {
        ssAdapter.set('sessionId', day().valueOf());
    },
    reset() {
        ssAdapter.remove('sessionId');
    },
    exists() {
        return !!this.get();
    },
};
