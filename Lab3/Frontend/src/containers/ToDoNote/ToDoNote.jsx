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
        newCheckboxText: '',
        showNewCheckbox: false,
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

    const onNewCheckboxChange = e => {
        setState(prev => ({
            ...prev,
            newCheckboxText: e.target.value,
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

    const newCheckboxTextReset = () => {
        setState(prev => ({
            ...prev,
            newCheckboxText: '',
        }));
    };

    const {
        onCheckboxAdd,
        onCheckboxDelete,
        onCheckboxRename,
        onCheckboxToggle,
        onNoteDelete,
    } = props;

    const { newCheckboxText, showNewCheckbox, currentNoteName } = state;

    const newCheckbox = showNewCheckbox ? (
        <div className={classes.AddCheckboxWrapper}>
            <form onSubmit={e => e.preventDefault()}>
                <Input
                    name="newcheckbox"
                    type="text"
                    value={newCheckboxText}
                    onChange={onNewCheckboxChange}
                    focused={true}
                />
                <Button
                    onClick={() =>
                        onCheckboxAdd(
                            note.id,
                            newCheckboxText,
                            newCheckboxTextReset,
                        )
                    }>
                    Add
                </Button>
            </form>
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
                </div>
                <div className={classes.Toolbar}>
                    <input
                        id={note.id}
                        type="checkbox"
                        className={classes.AddCheckbox}
                    />
                    <label htmlFor={note.id} className={classes.Add}>
                        <FaPlus onClick={toggleNewCheckboxShow} />
                    </label>
                    <FaTrash
                        className={classes.Remove}
                        onClick={() => onNoteDelete(note.id)}
                    />
                </div>
                {newCheckbox}
            </div>
        </div>
    );
};

export default ToDoNote;
