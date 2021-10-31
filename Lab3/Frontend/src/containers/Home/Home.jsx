import React, { Component } from 'react';
import Button from '../../components/Button/Button';
import FormField from '../../components/Form/FormField/FormField';
import Input from '../../components/Input/Input';
import ToDoNote from '../../components/ToDoNote/ToDoNote';
import axios from '../../shared/js/axiosInstance';

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
                query: `query {
                    note {
                        id
                        name
                        checkboxes {
                            id
                            text
                            checked
                        }
                    }
                }`,
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
                query: `mutation {
                    addNote(input: {
                        name: "${newNoteName}"
                    })
                    {
                        note {
                            id
                            name
                            checkboxes {
                                id
                                text
                                checked
                            }
                        }
                    }
                }`,
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
                query: `mutation {
                    addCheckbox(input: {
                        noteId: "${noteId}",
                        text: "${text}"
                    })
                    {
                        checkbox {
                            id
                            text
                            note {
                                id
                            }
                        }
                    }
                }`,
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
                query: `mutation {
                    deleteCheckbox(input: {
                        id: "${checkboxId}"
                    })
                    {
                        isSuccessful
                    }
                }`,
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
                query: `mutation {
                    putCheckbox(input: {
                        id: "${checkbox.id}",
                        text: "${text}",
                        checked: ${checkbox.checked}
                    })
                    {
                        checkbox {
                            id
                            text
                            checked
                            note {
                                id
                            }
                        }
                    }
                }`,
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
                query: `mutation {
                    deleteNote(input: {
                        id: "${noteId}"
                    })
                    {
                        isSuccessful
                    }
                }`,
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
                query: `mutation {
                    putCheckbox(input: {
                        id: "${checkbox.id}",
                        text: "${checkbox.text}",
                        checked: ${!checkbox.checked}
                    })
                    {
                        checkbox {
                            id
                            text
                            checked
                            note {
                                id
                            }
                        }
                    }
                }`,
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
                        />
                    ))}
                </div>
            </>
        );
    }
}

export default Home;
