import day from 'dayjs';
import jwtDecode from 'jwt-decode';
import lsTest from './lsTest';

export const authTokens = {
    get() {
        if (!lsTest()) return false;

        const authToken = localStorage.getItem('authToken');
        const refreshToken = localStorage.getItem('refreshToken');

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
        if (!lsTest()) return;
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('refreshToken', refreshToken);
    },
    reset() {
        if (!lsTest()) return;
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
    },
    exists() {
        return !!this.get();
    },
    valid() {
        if (!this.exists()) {
            return false;
        }

        const refreshToken = localStorage.getItem('refreshToken');

        const { exp } = jwtDecode(refreshToken);

        const expiryDate = day.unix(exp);

        return day().isBefore(day(expiryDate));
    },
};
