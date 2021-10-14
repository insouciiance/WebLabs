import React from 'react';

import classes from './Layout.scss';

const Layout = props => {
    const { children } = props;

    return (
        <>
            <header>
                <h2 className={classes.Logo}>Mail sender</h2>
            </header>
            <main>{children}</main>
        </>
    );
};

export default Layout;
