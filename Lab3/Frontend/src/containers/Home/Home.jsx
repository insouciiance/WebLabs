import React, { Component } from 'react';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import ToDoNote from '../ToDoNote/ToDoNote';
import axios from '../../shared/js/axiosInstance';
import graphql from '../../shared/js/graphql';

import classes from './Home.scss';
import Popup from '../../components/Popup/Popup';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import Spinner from '../../components/Spinner/Spinner';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notes: [],
            newNoteName: '',
            errors: null,
            notesLoading: false,
        };
    }

    componentDidMount() {
        this.setState({
            notesLoading: true,
        });

        axios
            .post('/', {
                query: graphql.getNotes,
            })
            .then(res => {
                console.log(res);

                this.setState({
                    notesLoading: false,
                });

                if (res.data.errors) {
                    this.setState({
                        errors: res.data.errors,
                    });
                    return;
                }

                this.setState({
                    notes: res.data.data.note,
                });
            });
    }

    onNoteAdd = () => {
        const { newNoteName, notes } = this.state;

        axios
            .post('/', {
                query: graphql.addNote(newNoteName),
            })
            .then(res => {
                console.log(res);
                if (res.data.errors) {
                    this.setState({
                        errors: res.data.errors,
                    });
                    return;
                }

                notes.unshift(res.data.data.addNote.note);
                this.setState({ notes });
            });
    };

    onNoteDelete = noteId => {
        const { notes } = this.state;

        axios
            .post('/', {
                query: graphql.deleteNote(noteId),
            })
            .then(res => {
                console.log(res);

                if (res.data.errors) {
                    this.setState({
                        errors: res.data.errors,
                    });
                    return;
                }

                const deletedNoteIndex = notes.findIndex(n => n.id === noteId);

                notes.splice(deletedNoteIndex, 1);

                this.setState({ notes });
            });
    };

    onCheckboxAdd = (noteId, text) => {
        const { notes } = this.state;

        axios
            .post('/', {
                query: graphql.addCheckbox(noteId, text),
            })
            .then(res => {
                console.log(res);

                if (res.data.errors) {
                    this.setState({
                        errors: res.data.errors,
                    });
                    return;
                }

                const checkbox = res.data.data.addCheckbox.checkbox;
                const checkboxNote = notes.find(n => n.id === checkbox.note.id);
                checkboxNote.checkboxes.push({
                    id: checkbox.id,
                    text: checkbox.text,
                    checked: checkbox.checked,
                });

                this.setState({ notes });
            });
    };

    onCheckboxRename = (checkboxId, text, onReset) => {
        const { notes } = this.state;

        const checkbox = notes
            .reduce(
                (acc, curr) => acc.concat(curr.checkboxes),
                notes[0].checkboxes,
            )
            .find(c => c.id === checkboxId);

        console.log(checkbox);

        axios
            .post('/', {
                query: graphql.putCheckbox(checkboxId, text, checkbox.checked),
            })
            .then(res => {
                console.log(res);

                if (res.data.errors) {
                    this.setState({
                        errors: res.data.errors,
                    });
                    onReset();
                    return;
                }

                const newCheckbox = res.data.data.putCheckbox.checkbox;

                const checkboxNote = notes.find(
                    n => n.id === newCheckbox.note.id,
                );

                const checkboxIndex = checkboxNote.checkboxes.findIndex(
                    c => c.id === newCheckbox.id,
                );
                checkboxNote.checkboxes[checkboxIndex] = {
                    id: newCheckbox.id,
                    text: newCheckbox.text,
                    checked: newCheckbox.checked,
                };

                this.setState({ notes });
            });
    };

    onCheckboxToggle = checkboxId => {
        const { notes } = this.state;

        const checkbox = notes
            .reduce(
                (acc, curr) => acc.concat(curr.checkboxes),
                notes[0].checkboxes,
            )
            .find(c => c.id === checkboxId);

        axios
            .post('/', {
                query: graphql.putCheckbox(
                    checkbox.id,
                    checkbox.text,
                    !checkbox.checked,
                ),
            })
            .then(res => {
                console.log(res);

                if (res.data.errors) {
                    this.setState({
                        errors: res.data.errors,
                    });
                    return;
                }

                const newCheckbox = res.data.data.putCheckbox.checkbox;

                const checkboxNote = notes.find(
                    n => n.id === newCheckbox.note.id,
                );

                const checkboxIndex = checkboxNote.checkboxes.findIndex(
                    c => c.id === newCheckbox.id,
                );
                checkboxNote.checkboxes[checkboxIndex] = {
                    id: newCheckbox.id,
                    text: newCheckbox.text,
                    checked: newCheckbox.checked,
                };

                this.setState({ notes });
            });
    };

    onCheckboxDelete = checkboxId => {
        const { notes } = this.state;

        axios
            .post('/', {
                query: graphql.deleteCheckbox(checkboxId),
            })
            .then(res => {
                console.log(res);

                if (res.data.errors) {
                    this.setState({
                        errors: res.data.errors,
                    });
                    return;
                }

                const checkboxNote = notes.find(n =>
                    n.checkboxes.some(c => c.id === checkboxId),
                );

                const deletedCheckboxIndex = checkboxNote.checkboxes.findIndex(
                    c => c.id === checkboxId,
                );

                checkboxNote.checkboxes.splice(deletedCheckboxIndex, 1);

                this.setState({ notes });
            });
    };

    onNoteRename = (noteId, newName, onReset) => {
        const { notes } = this.state;

        axios
            .post('/', {
                query: graphql.putNote(noteId, newName),
            })
            .then(res => {
                console.log(res);

                if (res.data.errors) {
                    this.setState({
                        errors: res.data.errors,
                    });
                    onReset();
                    return;
                }

                const newNote = res.data.data.putNote.note;

                const noteIndex = notes.findIndex(n => n.id === newNote.id);

                notes[noteIndex] = newNote;

                this.setState({ notes });
            });
    };

    onErrorDismiss = () =>
        this.setState({
            errors: null,
        });

    render() {
        const { notes, newNoteName, errors, notesLoading } = this.state;

        const errorsPopup = errors ? (
            <Popup onDismiss={this.onErrorDismiss} dismissText="Dismiss">
                {errors.map(e => (
                    <ErrorMessage key={e.message}>{e.message}</ErrorMessage>
                ))}
            </Popup>
        ) : null;

        const spinner = notesLoading ? <Spinner /> : null;

        return (
            <>
                <div className={classes.AddNoteWrapper}>
                    <h3 className={classes.AddNoteCta}>Add new</h3>
                    <Input
                        name="addnote"
                        value={newNoteName}
                        type="text"
                        onChange={e =>
                            this.setState({ newNoteName: e.target.value })
                        }
                    />
                    <Button onClick={this.onNoteAdd}>Add</Button>
                </div>
                <div className={classes.NotesContainer}>
                    {notes.map(n => (
                        <ToDoNote
                            key={n.id}
                            note={n}
                            onCheckboxAdd={this.onCheckboxAdd}
                            onCheckboxDelete={this.onCheckboxDelete}
                            onCheckboxRename={this.onCheckboxRename}
                            onCheckboxToggle={this.onCheckboxToggle}
                            onNoteDelete={this.onNoteDelete}
                            onNoteRename={this.onNoteRename}
                        />
                    ))}
                </div>
                {errorsPopup}
                {spinner}
            </>
        );
    }
}

export default Home;
