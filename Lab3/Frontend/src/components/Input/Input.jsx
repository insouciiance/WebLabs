import React from 'react';

import './Input.scss';

export default function Input(props) {
    const { value, onChange, type, name, focused, onBlur, style } = props;

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
        />
    );
}
