import React, { useState, useEffect } from 'react';
import ToDoCheckbox from './ToDoCheckbox/ToDoCheckbox';
import { FaPlus, FaTrash } from 'react-icons/fa';

import classes from './ToDoNote.scss';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';

const ToDoNote = props => {
    const { note } = props;

    const [state, setState] = useState({
        currentNoteName: note.name,
        showNewCheckbox: false,
        newCheckboxText: '',
    });

    useEffect(() => {
        setState(prev => ({
            ...prev,
            currentNoteName: note.name,
        }));
    }, [note]);

    const toggleNewCheckboxShow = () => {
        const { showNewCheckbox } = state;
        setState(prev => ({
            ...prev,
            showNewCheckbox: !showNewCheckbox,
        }));
    };

    const onCurrentNoteNameChange = e => {
        setState(prev => ({
            ...prev,
            currentNoteName: e.target.value,
        }));
    };

    const onNoteRenameConfirm = () => {
        const { onNoteRename } = props;
        const { currentNoteName } = state;

        if (note.name === currentNoteName) return;

        onNoteRename(note.id, currentNoteName, onNameReset);
    };

    const onNameReset = () => {
        setState(prev => ({
            ...prev,
            currentNoteName: note.name,
        }));
    };

    const onNewCheckboxBlur = (_, text) => {
        const { onCheckboxAdd } = props;

        setState(prev => ({
            ...prev,
            newCheckboxText: text,
        }));

        if (text) {
            onCheckboxAdd(note.id, text, newCheckboxReset);

            return;
        }

        setState(prev => ({
            ...prev,
            showNewCheckbox: false,
        }));
    };

    const newCheckboxReset = () => {
        setState(prev => ({
            ...prev,
            newCheckboxText: '',
            showNewCheckbox: false,
        }));
    };

    const {
        onCheckboxDelete,
        onCheckboxRename,
        onCheckboxToggle,
        onNoteDelete,
    } = props;

    const { showNewCheckbox, currentNoteName, newCheckboxText } = state;

    const newCheckbox = showNewCheckbox ? (
        <div className={classes.AddCheckboxWrapper}>
            <ToDoCheckbox
                checkbox={{ text: newCheckboxText }}
                onRename={onNewCheckboxBlur}
                focused={true}
                alwaysRename={true}
            />
        </div>
    ) : null;

    return (
        <div className={classes.NoteWrapper}>
            <div className={classes.NoteContentContainer}>
                <div className={classes.NoteNameWrapper}>
                    <Input
                        className={classes.NoteName}
                        value={currentNoteName}
                        onChange={onCurrentNoteNameChange}
                        onBlur={onNoteRenameConfirm}>
                        {note.name}
                    </Input>
                </div>
                <div className={classes.CheckboxesContainer}>
                    {note.checkboxes
                        .filter(c => !c.checked)
                        .map(c => (
                            <ToDoCheckbox
                                key={c.id}
                                checkbox={c}
                                onDelete={onCheckboxDelete}
                                onRename={onCheckboxRename}
                                onCheckToggle={onCheckboxToggle}
                            />
                        ))}
                </div>
                <div className={classes.CheckboxesContainer}>
                    {note.checkboxes
                        .filter(c => c.checked)
                        .map(c => (
                            <ToDoCheckbox
                                key={c.id}
                                checkbox={c}
                                onDelete={onCheckboxDelete}
                                onRename={onCheckboxRename}
                                onCheckToggle={onCheckboxToggle}
                            />
                        ))}
                    {newCheckbox}
                </div>
                <div className={classes.Toolbar}>
                    <FaPlus
                        className={classes.Add}
                        onClick={toggleNewCheckboxShow}
                    />
                    <FaTrash
                        className={classes.Remove}
                        onClick={() => onNoteDelete(note.id)}
                    />
                </div>
            </div>
        </div>
    );
};

export default ToDoNote;
