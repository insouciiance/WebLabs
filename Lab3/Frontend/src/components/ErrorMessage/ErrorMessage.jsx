import React from 'react';

import classes from './ErrorMessage.scss';

const ErrorMessage = ({ children }) => {
    return <p className={classes.ErrorMessage}>{children}</p>;
};

export default ErrorMessage;
