import React, { useState } from 'react';
import ToDoCheckbox from './ToDoCheckbox/ToDoCheckbox';
import { FaPlus, FaTrash } from 'react-icons/fa';

import classes from './ToDoNote.scss';
import Input from '../Input/Input';
import Button from '../Button/Button';

export default function ToDoNote(props) {
    const {
        note,
        onCheckboxAdd,
        onCheckboxDelete,
        onCheckboxRename,
        onCheckboxToggle,
        onNoteDelete,
    } = props;
    const [state, setState] = useState({
        newCheckboxText: '',
        showNewCheckbox: false,
    });

    const toggleNewCheckboxShow = () => {
        const { newCheckboxText, showNewCheckbox } = state;
        setState({
            newCheckboxText,
            showNewCheckbox: !showNewCheckbox,
        });
    };

    const onNewCheckboxChange = e => {
        const { showNewCheckbox } = state;

        setState({
            newCheckboxText: e.target.value,
            showNewCheckbox,
        });
    };

    const { newCheckboxText, showNewCheckbox } = state;

    return (
        <div className={classes.NoteWrapper}>
            <div className={classes.NoteContentContainer}>
                <p className={classes.NoteName}>{note.name}</p>
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
                {showNewCheckbox ? (
                    <div className={classes.AddCheckboxWrapper}>
                        <Input
                            name="newcheckbox"
                            type="text"
                            value={newCheckboxText}
                            onChange={onNewCheckboxChange}
                            focused={true}
                        />
                        <Button
                            onClick={() =>
                                onCheckboxAdd(note.id, newCheckboxText)
                            }>
                            Add
                        </Button>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
