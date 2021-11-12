import React from 'react';

import classes from './Form.scss';

const Form = ({ children, onSubmit }) => {
    return (
        <div className={classes.FormWrapper}>
            <form onSubmit={onSubmit}>{children}</form>
        </div>
    );
};

export default Form;
