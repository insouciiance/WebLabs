import React from 'react';

import classes from './TextArea.scss';

const TextArea = props => {
    const { name, labelText, onChange, value } = props;

    return (
        <div className={classes.Wrapper}>
            <label htmlFor={name}>{labelText}</label>
            <textarea name={name} id={name} onChange={onChange} value={value} />
        </div>
    );
};

export default TextArea;
