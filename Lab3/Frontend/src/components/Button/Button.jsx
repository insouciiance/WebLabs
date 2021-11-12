import React from 'react';

import classes from './Button.scss';

const Button = ({ onClick, children }) => {
    return (
        <button className={classes.Button} onClick={onClick}>
            {children}
        </button>
    );
};

export default Button;
