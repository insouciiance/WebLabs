import React from 'react';

import { authToken } from '../../shared/js/authToken';
import { credentials } from '../../shared/js/credentials';

import classes from './Layout.scss';

const Layout = props => {
    const { children, onLogout } = props;

    const userAuthenticated = authToken.exists();

    const headerText = credentials.exists()
        ? `Hello, ${credentials.get().username}`
        : 'Keep notes';

    const logoutLink = userAuthenticated ? (
        <p className={classes.Logout} onClick={onLogout}>
            Logout
        </p>
    ) : null;

    return (
        <div>
            <header>
                <h2
                    className={`${classes.HeaderCta} ${
                        userAuthenticated ? classes.CtaLeft : null
                    }`}>
                    {headerText}
                </h2>
                {logoutLink}
            </header>
            {children}
        </div>
    );
};

export default Layout;
