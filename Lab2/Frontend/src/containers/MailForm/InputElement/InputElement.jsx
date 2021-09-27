import React from 'react';

import classes from './InputElement.scss';

const InputElement = props => (
    <div className={classes.Wrapper}>
        <label htmlFor={props.name}>{props.labelText}</label>
        <input
            name={props.name}
            id={props.name}
            type={props.type}
            onChange={props.onChange}
        />
    </div>
);

export default InputElement;
