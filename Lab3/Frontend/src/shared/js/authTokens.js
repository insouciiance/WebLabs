import day from 'dayjs';
import jwtDecode from 'jwt-decode';
import lsAdapter from './lsAdapter';

export const authTokens = {
    get() {
        const authToken = lsAdapter.get('authToken');
        const refreshToken = lsAdapter.get('refreshToken');

        let decodedToken;

        try {
            decodedToken = jwtDecode(refreshToken);
        } catch {
            return null;
        }

        const { exp } = decodedToken;

        const expires = day.unix(exp);

        if (authToken && refreshToken && expires) {
            return {
                authToken,
                refreshToken,
                expires,
            };
        }

        return null;
    },
    set(authToken, refreshToken) {
        lsAdapter.set('authToken', authToken);
        lsAdapter.set('refreshToken', refreshToken);
    },
    reset() {
        lsAdapter.remove('authToken');
        lsAdapter.remove('refreshToken');
    },
    exists() {
        return !!this.get();
    },
    valid() {
        if (!this.exists()) {
            return false;
        }

        const refreshToken = lsAdapter.get('refreshToken');

        const { exp } = jwtDecode(refreshToken);

        const expiryDate = day.unix(exp);

        return day().isBefore(day(expiryDate));
    },
};
