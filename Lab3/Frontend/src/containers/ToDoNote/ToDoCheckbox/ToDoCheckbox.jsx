import React, { useState, useEffect } from 'react';
import { FaCheckSquare, FaSquare, FaTimes } from 'react-icons/fa';
import Input from '../../../components/Input/Input';

import classes from './ToDoCheckbox.scss';

const ToDoCheckbox = ({
    checkbox,
    onDelete,
    onRename,
    onCheckToggle,
    focused,
    alwaysRename,
}) => {
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

        if (checkboxText == checkbox.text && !alwaysRename) {
            return;
        }

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
            {checkbox.checked ? (
                <FaCheckSquare
                    className={classes.CheckSquare}
                    onClick={() => onCheckToggle(checkbox.id)}
                />
            ) : (
                <FaSquare
                    className={classes.CheckSquare}
                    onClick={() => onCheckToggle(checkbox.id)}
                />
            )}
            <form
                onSubmit={e => {
                    e.preventDefault();
                    onRenameConfirm();
                }}>
                <Input
                    name="checkboxrename"
                    type="text"
                    value={checkboxText}
                    onBlur={onRenameConfirm}
                    onChange={onCheckboxTextChange}
                    focused={focused}
                    style={
                        checkbox.checked
                            ? {
                                  textDecoration: 'line-through',
                              }
                            : null
                    }
                />
            </form>
            <FaTimes
                className={classes.DeleteButton}
                onClick={() => onDelete(checkbox.id)}
            />
        </div>
    );
};

export default ToDoCheckbox;
