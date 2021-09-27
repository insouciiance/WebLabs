import React from 'react';

import classes from './Button.scss';

const Button = props => {
    const { type, clicked, disabled, children } = props;
    return (
        <button
            type={type}
            className={classes.Button}
            onClick={clicked}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;
