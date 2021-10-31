import React, { useState } from 'react';
import { FaCheck, FaTimes, FaTrash } from 'react-icons/fa';
import Input from '../../Input/Input';

import classes from './ToDoCheckbox.scss';

export default function ToDoCheckbox(props) {
    const { checkbox, onDelete, onRename } = props;

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

        onRename(checkbox.id, checkboxText);
        setState({
            idCheckboxRenaming: false,
            checkboxText,
        });
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
                <p
                    className={classes.CheckboxText}
                    onClick={toggleCheckboxRename}>
                    {checkboxText}
                </p>
            )}
            <div className={classes.ToolsWrapper}>
                <FaTrash onClick={() => onDelete(checkbox.id)} />
            </div>
        </div>
    );
}
