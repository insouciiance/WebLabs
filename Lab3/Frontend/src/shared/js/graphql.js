const graphql = {
    login: (userName, password) =>
        `mutation {
            login(input: {
                userName: "${userName}",
                password: "${password}"
            })
            {
                jwtToken
                expires
            }
        }`,
    register: (userName, email, password, passwordConfirm) =>
        `mutation {
            register(input: {
                userName: "${userName}",
                email: "${email}",
                password: "${password}",
                passwordConfirm: "${passwordConfirm}"
            })
            {
                jwtToken
                expires
            }
        }`,
    logout: `mutation {
        logout()
        {
            isSuccessful
        }
    }`,
    getNotes: `query {
        note(order: { dateCreated: DESC }) {
            id
            name
            checkboxes {
                id
                text
                checked
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
    onUserLoginSubscription: `subscription {
        onUserLogin()
        {
            jwtToken
            expires
        }
    }`,
};

export default graphql;
