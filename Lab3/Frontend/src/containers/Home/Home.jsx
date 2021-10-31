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

    addCheckbox = (noteId, text) => {
        const { notes } = this.state;

        axios
            .post('/', {
                query: `mutation {
                    addCheckbox(input: {
                        noteId: "${noteId}"
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
                            addCheckbox={this.addCheckbox}
                        />
                    ))}
                </div>
            </>
        );
    }
}

export default Home;
