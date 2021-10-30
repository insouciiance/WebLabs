import React from 'react';

import classes from './FormField.scss';

export default function FormField(props) {
    const { value, onChange, type, name, label } = props;

    return (
        <div className={classes.FormFieldWrapper}>
            <label htmlFor={name}>{label}</label>
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
            />
        </div>
    );
}
