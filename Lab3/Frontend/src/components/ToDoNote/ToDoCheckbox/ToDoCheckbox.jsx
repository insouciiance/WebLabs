import React from 'react';
import { FaPen, FaTrash } from 'react-icons/fa';

import classes from './ToDoCheckbox.scss';

export default function ToDoCheckbox(props) {
    const { checkbox } = props;

    return (
        <div className={classes.CheckboxWrapper}>
            <p className={classes.CheckboxText}>{checkbox.text}</p>
            <div className={classes.ToolsWrapper}>
                <FaPen />
                <FaTrash />
            </div>
        </div>
    );
}
