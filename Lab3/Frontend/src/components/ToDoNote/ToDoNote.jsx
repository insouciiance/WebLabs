import React, { Component } from 'react';
import ToDoCheckbox from './ToDoCheckbox/ToDoCheckbox';
import { FaPlus, FaTrash } from 'react-icons/fa';

import classes from './ToDoNote.scss';
import Input from '../Input/Input';
import Button from '../Button/Button';

export default class ToDoNote extends Component {
    constructor(props) {
        super(props);

        const { note } = props;

        this.state = {
            currentNoteName: note.name,
            newCheckboxText: '',
            showNewCheckbox: false,
        };
    }

    toggleNewCheckboxShow = () => {
        const { showNewCheckbox } = this.state;
        this.setState({
            showNewCheckbox: !showNewCheckbox,
        });
    };

    onNewCheckboxChange = e => {
        this.setState({
            newCheckboxText: e.target.value,
        });
    };

    onCurrentNoteNameChange = e => {
        this.setState({
            currentNoteName: e.target.value,
        });
    };

    onNoteRenameConfirm = () => {
        const { note, onNoteRename } = this.props;
        const { currentNoteName } = this.state;

        if (note.name === currentNoteName) return;

        onNoteRename(note.id, currentNoteName);
    };

    render() {
        const {
            note,
            onCheckboxAdd,
            onCheckboxDelete,
            onCheckboxRename,
            onCheckboxToggle,
            onNoteDelete,
            onNoteRename,
        } = this.props;

        const { newCheckboxText, showNewCheckbox, currentNoteName } =
            this.state;

        const newCheckbox = showNewCheckbox ? (
            <div className={classes.AddCheckboxWrapper}>
                <Input
                    name="newcheckbox"
                    type="text"
                    value={newCheckboxText}
                    onChange={this.onNewCheckboxChange}
                    focused={true}
                />
                <Button onClick={() => onCheckboxAdd(note.id, newCheckboxText)}>
                    Add
                </Button>
            </div>
        ) : null;

        return (
            <div className={classes.NoteWrapper}>
                <div className={classes.NoteContentContainer}>
                    <div className={classes.NoteNameWrapper}>
                        <Input
                            className={classes.NoteName}
                            value={currentNoteName}
                            onChange={this.onCurrentNoteNameChange}
                            onBlur={this.onNoteRenameConfirm}>
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
                            <FaPlus onClick={this.toggleNewCheckboxShow} />
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
    }
}
