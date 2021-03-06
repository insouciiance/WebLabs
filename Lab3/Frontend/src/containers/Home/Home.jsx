import React, { useState, useEffect } from 'react';
import {
    ApolloClient,
    ApolloProvider,
    InMemoryCache,
    useSubscription,
    gql,
    createHttpLink,
    split,
} from '@apollo/client';
import { withRouter } from 'react-router';
import { WebSocketLink } from '@apollo/client/link/ws';
import { setContext } from '@apollo/client/link/context';
import { getMainDefinition } from '@apollo/client/utilities';

import Popup from '../../components/Popup/Popup';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import Spinner from '../../components/Spinner/Spinner';
import { baseGQLURL, baseURLWSS } from '../../shared/js/config';
import { authTokens } from '../../shared/js/authTokens';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import ToDoNote from '../ToDoNote/ToDoNote';
import axios from '../../shared/js/axiosGQLInstance';
import graphql from '../../shared/js/graphql';

import classes from './Home.scss';
import { session } from '../../shared/js/session';
import Backdrop from '../../components/Backdrop/Backdrop';

const wsLink = new WebSocketLink({
    uri: baseURLWSS,
    options: {
        reconnect: true,
    },
});

const httpLink = createHttpLink({
    uri: baseGQLURL,
});

const authLink = setContext((_, { headers }) => {
    const { token } = authTokens.get();
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
        },
    };
});

const link = split(
    ({ query }) => {
        const { kind, operation } = getMainDefinition(query);
        return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    authLink.concat(httpLink),
);

const client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
});

const Home = () => {
    const [state, setState] = useState({
        notes: [],
        newNoteName: '',
        errors: null,
        notesLoading: false,
    });

    const { data } = useSubscription(
        gql`
            ${graphql.onNotesChangeSubscription()}
        `,
    );

    if (
        data &&
        data.onNotesUpdate.notes != state.notes &&
        data.onNotesUpdate.sessionId != session.get()
    ) {
        setState(prev => ({
            ...prev,
            notes: data.onNotesUpdate.notes,
        }));
    }

    useEffect(() => {
        setState(prev => ({
            ...prev,
            notesLoading: true,
        }));

        axios
            .post('/', {
                query: graphql.getNotes,
            })
            .then(res => {
                setState(prev => ({
                    ...prev,
                    notesLoading: false,
                }));

                if (res.data.errors) {
                    setState(prev => ({
                        ...prev,
                        errors: res.data.errors,
                    }));
                    return;
                }

                setState(prev => ({
                    ...prev,
                    notes: res.data.data.note,
                }));
            });
    }, []);

    const onNoteAdd = () => {
        const { newNoteName, notes } = state;

        setState(prev => ({
            ...prev,
            notesLoading: true,
        }));

        axios
            .post('/', {
                query: graphql.addNote(newNoteName),
            })
            .then(res => {
                if (res.data.errors) {
                    setState(prev => ({
                        ...prev,
                        errors: res.data.errors,
                        notesLoading: false,
                    }));
                    return;
                }

                notes.unshift(res.data.data.addNote.note);
                setState(prev => ({
                    ...prev,
                    notes,
                    newNoteName: '',
                    notesLoading: false,
                }));
            });
    };

    const onNoteDelete = noteId => {
        const { notes } = state;

        axios
            .post('/', {
                query: graphql.deleteNote(noteId),
            })
            .then(res => {
                if (res.data.errors) {
                    setState(prev => ({
                        ...prev,
                        errors: res.data.errors,
                    }));
                    return;
                }

                const deletedNoteIndex = notes.findIndex(n => n.id === noteId);

                notes.splice(deletedNoteIndex, 1);

                setState(prev => ({
                    ...prev,
                    notes,
                }));
            });
    };

    const onCheckboxAdd = (noteId, text, onReset) => {
        const { notes } = state;

        axios
            .post('/', {
                query: graphql.addCheckbox(noteId, text),
            })
            .then(res => {
                if (res.data.errors) {
                    setState(prev => ({
                        ...prev,
                        errors: res.data.errors,
                    }));
                    return;
                }

                const checkbox = res.data.data.addCheckbox.checkbox;
                const checkboxNote = notes.find(n => n.id === checkbox.note.id);
                checkboxNote.checkboxes.push({
                    id: checkbox.id,
                    text: checkbox.text,
                    checked: checkbox.checked,
                    note: {
                        id: checkboxNote.id,
                    },
                });

                setState(prev => ({
                    ...prev,
                    notes,
                }));

                onReset();
            });
    };

    const onCheckboxRename = (checkboxId, text, onReset) => {
        const { notes } = state;

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
                if (res.data.errors) {
                    setState(prev => ({
                        ...prev,
                        errors: res.data.errors,
                    }));
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
                    note: {
                        id: checkboxNote.id,
                    },
                };

                setState(prev => ({
                    ...prev,
                    notes,
                }));
            });
    };

    const onCheckboxToggle = checkboxId => {
        const { notes } = state;

        const checkbox = notes
            .reduce(
                (acc, curr) => acc.concat(curr.checkboxes),
                notes[0].checkboxes,
            )
            .find(c => c.id === checkboxId);

        const checkboxNote = notes.find(n => n.id === checkbox.note.id);

        const checkboxIndex = checkboxNote.checkboxes.findIndex(
            c => c.id === checkbox.id,
        );

        checkboxNote.checkboxes[checkboxIndex] = {
            id: checkbox.id,
            text: checkbox.text,
            checked: !checkbox.checked,
            note: {
                id: checkboxNote.id,
            },
        };

        setState(prev => ({
            ...prev,
            notes,
        }));

        axios
            .post('/', {
                query: graphql.putCheckbox(
                    checkbox.id,
                    checkbox.text,
                    !checkbox.checked,
                ),
            })
            .then(res => {
                if (res.data.errors) {
                    checkboxNote.checkboxes[checkboxIndex].checked =
                        checkbox.checked;

                    setState(prev => ({
                        ...prev,
                        errors: res.data.errors,
                        notes,
                    }));
                    return;
                }
            });
    };

    const onCheckboxDelete = checkboxId => {
        const { notes } = state;

        axios
            .post('/', {
                query: graphql.deleteCheckbox(checkboxId),
            })
            .then(res => {
                if (res.data.errors) {
                    setState(prev => ({
                        ...prev,
                        errors: res.data.errors,
                    }));
                    return;
                }

                const checkboxNote = notes.find(n =>
                    n.checkboxes.some(c => c.id === checkboxId),
                );

                const deletedCheckboxIndex = checkboxNote.checkboxes.findIndex(
                    c => c.id === checkboxId,
                );

                checkboxNote.checkboxes.splice(deletedCheckboxIndex, 1);

                setState(prev => ({
                    ...prev,
                    notes,
                }));
            });
    };

    const onNoteRename = (noteId, newName, onReset) => {
        const { notes } = state;

        axios
            .post('/', {
                query: graphql.putNote(noteId, newName),
            })
            .then(res => {
                if (res.data.errors) {
                    setState(prev => ({
                        ...prev,
                        errors: res.data.errors,
                    }));
                    onReset();
                    return;
                }

                const newNote = res.data.data.putNote.note;

                const noteIndex = notes.findIndex(n => n.id === newNote.id);

                notes[noteIndex] = newNote;

                setState(prev => ({
                    ...prev,
                    notes,
                }));
            });
    };

    const onErrorDismiss = () =>
        setState(prev => ({
            ...prev,
            errors: null,
        }));

    const { notes, newNoteName, errors, notesLoading } = state;

    const errorsPopup = errors ? (
        <Popup onDismiss={onErrorDismiss} dismissText="Dismiss">
            {errors.map(e => (
                <ErrorMessage key={e.message}>{e.message}</ErrorMessage>
            ))}
        </Popup>
    ) : null;

    const spinner = notesLoading ? (
        <Backdrop>
            <Spinner />
        </Backdrop>
    ) : null;

    return (
        <>
            <div className={classes.AddNoteWrapper}>
                <h3 className={classes.AddNoteCta}>Add new</h3>
                <form onSubmit={e => e.preventDefault()}>
                    <Input
                        name="addnote"
                        value={newNoteName}
                        type="text"
                        onChange={e =>
                            setState(prev => ({
                                ...prev,
                                newNoteName: e.target.value,
                            }))
                        }
                    />
                    <Button onClick={onNoteAdd} disabled={notesLoading}>
                        Add
                    </Button>
                </form>
            </div>
            <div className={classes.NotesContainer}>
                {notes.map(n => (
                    <ToDoNote
                        key={n.id}
                        note={n}
                        onCheckboxAdd={onCheckboxAdd}
                        onCheckboxDelete={onCheckboxDelete}
                        onCheckboxRename={onCheckboxRename}
                        onCheckboxToggle={onCheckboxToggle}
                        onNoteDelete={onNoteDelete}
                        onNoteRename={onNoteRename}
                    />
                ))}
            </div>
            {errorsPopup}
            {spinner}
        </>
    );
};

export default withRouter(() => (
    <ApolloProvider client={client}>
        <Home />
    </ApolloProvider>
));
