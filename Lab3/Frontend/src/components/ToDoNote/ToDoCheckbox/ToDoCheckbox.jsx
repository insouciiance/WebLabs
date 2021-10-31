import React, { useState } from 'react';
import { FaCheck, FaCheckSquare, FaSquare, FaTrash } from 'react-icons/fa';
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
            {isCheckboxRenaming ? (
                <Input
                    name="checkboxrename"
                    type="text"
                    value={checkboxText}
                    focused={true}
                    onBlur={onRenameConfirm}
                    onChange={onCheckboxTextChange}
                />
            ) : (
                <div
                    className={classes.CheckboxTextWrapper}
                    onClick={toggleCheckboxRename}
                    data-checked={checkbox.checked}>
                    <span className={classes.CheckboxText}>{checkboxText}</span>
                </div>
            )}
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
