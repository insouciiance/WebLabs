import React from 'react';

import classes from './InputElement.scss';

const InputElement = props => {
    const { name, labelText, type, onChange } = props;

    return (
        <div className={classes.Wrapper}>
            <label htmlFor={name}>{labelText}</label>
            <input name={name} id={name} type={type} onChange={onChange} />
        </div>
    );
};

export default InputElement;
