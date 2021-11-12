import React, { useState, useEffect } from 'react';
import { FaCheckSquare, FaSquare, FaTimes } from 'react-icons/fa';
import Input from '../../../components/Input/Input';

import classes from './ToDoCheckbox.scss';

const ToDoCheckbox = ({ checkbox, onDelete, onRename, onCheckToggle }) => {
    const [state, setState] = useState({
        checkboxText: checkbox.text,
    });

    useEffect(() => {
        setState(prev => ({
            ...prev,
            checkboxText: checkbox.text,
        }));
    }, [checkbox]);

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
                <FaTimes
                    className={classes.DeleteButton}
                    onClick={() => onDelete(checkbox.id)}
                />
            </div>
        </div>
    );
};

export default ToDoCheckbox;
