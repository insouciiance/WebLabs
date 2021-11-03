import React from 'react';
import { NavLink } from 'react-router-dom';
import { authToken } from '../../shared/js/authToken';

import classes from './Layout.scss';

export default function Layout(props) {
    const { children, onLogout } = props;

    const logoutLink = authToken.exists() ? (
        <NavLink className={classes.Logout} onClick={onLogout} to="/">
            Logout
        </NavLink>
    ) : null;

    return (
        <div>
            <header>
                <h2 className={classes.HeaderCta}>Keep notes</h2>
                {logoutLink}
            </header>
            {children}
        </div>
    );
}
