import React from 'react';
import Input from '../../Input/Input';

import classes from './FormField.scss';

const FormField = ({ value, onChange, type, name, label }) => {
    return (
        <div className={classes.FormFieldWrapper}>
            <label htmlFor={name}>{label}</label>
            <Input name={name} type={type} value={value} onChange={onChange} />
        </div>
    );
};

export default FormField;
