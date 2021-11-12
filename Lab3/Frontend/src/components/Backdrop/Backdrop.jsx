import React from 'react';

import classes from './Backdrop.scss';

const Backdrop = ({ onDismiss, children }) => {
    return (
        <div className={classes.Backdrop} onClick={onDismiss}>
            <div className={classes.ItemsContainer}>{children}</div>
        </div>
    );
};

export default Backdrop;
