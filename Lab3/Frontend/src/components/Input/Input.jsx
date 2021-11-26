import React from 'react';

import './Input.scss';

const Input = props => {
    const {
        value,
        onChange,
        type,
        name,
        focused,
        onBlur,
        style,
        className,
        placeholder,
    } = props;

    return (
        <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            autoFocus={focused}
            onBlur={onBlur}
            style={style}
            className={className}
            placeholder={placeholder}
            autoComplete="on"
        />
    );
};

export default Input;
