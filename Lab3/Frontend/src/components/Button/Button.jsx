import React from 'react';

import classes from './Button.scss';

const Button = ({ onClick, disabled, children }) => {
    return (
        <button
            className={classes.Button}
            onClick={onClick}
            disabled={!!disabled}>
            {children}
        </button>
    );
};

export default Button;
