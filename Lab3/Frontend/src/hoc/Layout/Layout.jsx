import React from 'react';

import { authTokens } from '../../shared/js/authTokens';
import { credentials } from '../../shared/js/credentials';

import classes from './Layout.scss';

const Layout = props => {
    const { children, onLogout } = props;

    const userAuthenticated = authTokens.exists();

    const headerText = credentials.exists()
        ? `Hello, ${credentials.get().username}`
        : 'To-do notes';

    const logoutLink = userAuthenticated ? (
        <p className={classes.Logout} onClick={onLogout}>
            Logout
        </p>
    ) : null;

    return (
        <div>
            <header>
                <h2
                    className={
                        userAuthenticated
                            ? `${classes.HeaderCta} ${classes.CtaLeft}`
                            : classes.HeaderCta
                    }>
                    {headerText}
                </h2>
                {logoutLink}
            </header>
            {children}
        </div>
    );
};

export default Layout;
