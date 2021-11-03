import React, { Component } from 'react';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import ToDoNote from '../ToDoNote/ToDoNote';
import axios from '../../shared/js/axiosInstance';
import graphql from '../../shared/js/graphql';

import classes from './Home.scss';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notes: [],
            newNoteName: '',
        };
    }

    componentDidMount() {
        axios
            .post('/', {
                query: graphql.getNotes,
            })
            .then(res => {
                console.log(res);
                if (!res.data.errors) {
                    this.setState({ notes: res.data.data.note });
                }
            });
    }

    addNote = () => {
        const { newNoteName, notes } = this.state;

        axios
            .post('/', {
                query: graphql.addNote(newNoteName),
            })
            .then(res => {
                console.log(res);
                if (!res.data.errors) {
                    notes.unshift(res.data.data.addNote.note);
                    this.setState({ notes });
                }
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
                if (!res.data.errors) {
                    const checkbox = res.data.data.addCheckbox.checkbox;
                    const checkboxNote = notes.find(
                        n => n.id === checkbox.note.id,
                    );
                    checkboxNote.checkboxes.push({
                        id: checkbox.id,
                        text: checkbox.text,
                    });

                    this.setState({ notes });
                }
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
                if (
                    !res.data.errors &&
                    res.data.data.deleteCheckbox.isSuccessful
                ) {
                    const checkboxNote = notes.find(n =>
                        n.checkboxes.some(c => c.id === checkboxId),
                    );

                    const deletedCheckboxIndex =
                        checkboxNote.checkboxes.findIndex(
                            c => c.id === checkboxId,
                        );

                    checkboxNote.checkboxes.splice(deletedCheckboxIndex, 1);

                    this.setState({ notes });
                }
            });
    };

    onCheckboxRename = (checkboxId, text) => {
        const { notes } = this.state;

        const checkbox = notes
            .reduce(
                (acc, curr) => acc.concat(curr.checkboxes),
                notes[0].checkboxes,
            )
            .find(c => c.id === checkboxId);

        axios
            .post('/', {
                query: graphql.putCheckbox(checkboxId, text, checkbox.checked),
            })
            .then(res => {
                console.log(res);
                if (!res.data.errors) {
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
                }
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
                if (!res.data.errors && res.data.data.deleteNote.isSuccessful) {
                    const deletedNoteIndex = notes.findIndex(
                        n => n.id === noteId,
                    );

                    notes.splice(deletedNoteIndex, 1);

                    this.setState({ notes });
                }
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
                if (!res.data.errors) {
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
                }
            });
    };

    onNoteRename = (noteId, newName) => {
        const { notes } = this.state;

        axios
            .post('/', {
                query: graphql.putNote(noteId, newName),
            })
            .then(res => {
                console.log(res);
                if (!res.data.errors) {
                    const newNote = res.data.data.putNote.note;

                    const noteIndex = notes.findIndex(n => n.id === newNote.id);

                    notes[noteIndex] = newNote;

                    this.setState({ notes });
                }
            });
    };

    render() {
        const { notes, newNoteName } = this.state;

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
                    <Button onClick={this.addNote}>Add</Button>
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
            </>
        );
    }
}

export default Home;
