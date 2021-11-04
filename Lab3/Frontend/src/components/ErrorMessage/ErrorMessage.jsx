import React from 'react';

import classes from './ErrorMessage.scss';

export default function ErrorMessage(props) {
    const { children } = props;

    return <p className={classes.ErrorMessage}>{children}</p>;
}
