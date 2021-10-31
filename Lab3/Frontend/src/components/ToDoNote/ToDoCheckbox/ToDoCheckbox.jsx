import React, { useState } from 'react';
import { FaCheckSquare, FaSquare, FaTrash } from 'react-icons/fa';
import Input from '../../Input/Input';

import classes from './ToDoCheckbox.scss';

export default function ToDoCheckbox(props) {
    const { checkbox, onDelete, onRename, onCheckToggle } = props;

    const [state, setState] = useState({
        isCheckboxRenaming: false,
        checkboxText: checkbox.text,
    });

    const toggleCheckboxRename = () => {
        const { isCheckboxRenaming, checkboxText } = state;

        setState({
            isCheckboxRenaming: !isCheckboxRenaming,
            checkboxText,
        });
    };

    const onCheckboxTextChange = e => {
        const { isCheckboxRenaming } = state;

        setState({
            isCheckboxRenaming: isCheckboxRenaming,
            checkboxText: e.target.value,
        });
    };

    const onRenameConfirm = () => {
        const { checkboxText } = state;

        setState({
            idCheckboxRenaming: false,
            checkboxText,
        });

        if (checkboxText === checkbox.text) return;

        onRename(checkbox.id, checkboxText);
    };

    const { isCheckboxRenaming, checkboxText } = state;

    return (
        <div className={classes.CheckboxWrapper}>
            <Input
                name="checkboxrename"
                type="text"
                value={checkboxText}
                focused={isCheckboxRenaming}
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
