import React, { useState } from 'react';
import { FaCheckSquare, FaSquare, FaTrash } from 'react-icons/fa';
import Input from '../../../components/Input/Input';

import classes from './ToDoCheckbox.scss';

export default function ToDoCheckbox(props) {
    const { checkbox, onDelete, onRename, onCheckToggle } = props;

    const [state, setState] = useState({
        checkboxText: checkbox.text,
    });

    const onCheckboxTextChange = e => {
        setState({
            checkboxText: e.target.value,
        });
    };

    const onRenameConfirm = () => {
        const { checkboxText } = state;

        setState({
            checkboxText,
        });

        if (checkboxText === checkbox.text) return;

        onRename(checkbox.id, checkboxText, onTextReset);
    };

    const onTextReset = () => {
        setState({
            checkboxText: checkbox.text,
        });
    };

    const { checkboxText } = state;

    return (
        <div className={classes.CheckboxWrapper}>
            <Input
                name="checkboxrename"
                type="text"
                value={checkboxText}
                onBlur={onRenameConfirm}
                onChange={onCheckboxTextChange}
                style={
                    checkbox.checked
                        ? {
                              textDecoration: 'line-through',
                          }
                        : null
                }
            />
            <div className={classes.Toolbar}>
                {checkbox.checked ? (
                    <FaCheckSquare onClick={() => onCheckToggle(checkbox.id)} />
                ) : (
                    <FaSquare onClick={() => onCheckToggle(checkbox.id)} />
                )}
                <FaTrash onClick={() => onDelete(checkbox.id)} />
            </div>
        </div>
    );
}
