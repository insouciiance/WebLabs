import React from 'react';

import classes from './Backdrop.scss';

export default function Backdrop(props) {
    const { onDismiss, children } = props;

    return (
        <div className={classes.Backdrop} onClick={onDismiss}>
            <div className={classes.ItemsContainer}>{children}</div>
        </div>
    );
}
