import React from 'react';

import classes from './TextArea.scss';

const TextArea = props => (
    <div className={classes.Wrapper}>
        <label htmlFor={props.name}>{props.labelText}</label>
        <textarea name={props.name} id={props.name} onChange={props.onChange} />
    </div>
);

export default TextArea;
