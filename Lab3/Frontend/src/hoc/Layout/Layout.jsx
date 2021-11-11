import React from 'react';

import { authToken } from '../../shared/js/authToken';
import { credentials } from '../../shared/js/credentials';
import classes from './Layout.scss';

function Layout(props) {
    const { children, onLogout } = props;

    const headerText = credentials.exists()
        ? `Hello, ${credentials.get().username}`
        : 'Keep notes';

    const logoutLink = authToken.exists() ? (
        <p className={classes.Logout} onClick={onLogout}>
            Logout
        </p>
    ) : null;

    return (
        <div>
            <header>
                <h2 className={classes.HeaderCta}>{headerText}</h2>
                {logoutLink}
            </header>
            {children}
        </div>
    );
}

export default Layout;
