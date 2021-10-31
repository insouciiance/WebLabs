import React from 'react';

import classes from './Layout.scss';

export default function Layout(props) {
    const { children } = props;

    return (
        <div>
            <header>
                <h2 className={classes.HeaderCta}>Keep notes</h2>
            </header>
            {children}
        </div>
    );
}
