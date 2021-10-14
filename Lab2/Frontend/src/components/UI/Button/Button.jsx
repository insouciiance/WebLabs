import React from 'react';

import classes from './Button.scss';

const Button = props => {
    const { type, onClick, disabled, children } = props;
    return (
        <button
            type={type}
            className={classes.Button}
            onClick={onClick}
            disabled={disabled}>
            {children}
        </button>
    );
};

export default Button;
