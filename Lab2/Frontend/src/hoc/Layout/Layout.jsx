import React from 'react';

import classes from './Layout.scss';

const Layout = props => (
    <>
        <header>
            <h2 className={classes.Logo}>Mail sender</h2>
        </header>
        <main>{props.children}</main>
    </>
);

export default Layout;
