import { authToken } from './authToken';

const graphql = {
    getNotes: `query {
        note(order: { dateCreated: DESC }) {
            id
            name
            checkboxes {
                id
                text
                checked
                note {
                    id
                }
            }
        }
    }`,
    addNote: newNoteName =>
        `mutation {
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
    putNote: (noteId, newName) =>
        `mutation {
            putNote(input: {
                id: "${noteId}",
                name: "${newName}"
            })
            {
                note {
                    id
                    name
                    checkboxes {
                        id
                        text
                        checked
                        note {
                            id
                        }
                    }
                }
            }
        }`,
    deleteNote: noteId =>
        `mutation {
            deleteNote(input: {
                id: "${noteId}"
            })
            {
                isSuccessful
            }
        }`,
    addCheckbox: (noteId, text) =>
        `mutation {
            addCheckbox(input: {
                noteId: "${noteId}",
                text: "${text}"
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
    deleteCheckbox: checkboxId =>
        `mutation {
            deleteCheckbox(input: {
                id: "${checkboxId}"
            })
            {
                isSuccessful
            }
        }`,
    putCheckbox: (id, text, checked) =>
        `mutation {
            putCheckbox(input: {
                id: "${id}",
                text: "${text}",
                checked: ${checked}
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
    onNotesChangeSubscription: () => {
        const { token } = authToken.get();
        return `subscription {
        onNotesUpdate(jwtToken: "${token}")
        {
            notes {
                id
                name
                checkboxes {
                    id
                    text
                    checked
                    note {
                        id
                    }
                }
            }
            sessionId
        }
    }`;
    },
};

export default graphql;
