import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import Backdrop from '../../../components/Backdrop/Backdrop';

import Button from '../../../components/Button/Button';
import ErrorMessage from '../../../components/ErrorMessage/ErrorMessage';
import Form from '../../../components/Form/Form';
import FormField from '../../../components/Form/FormField/FormField';
import Popup from '../../../components/Popup/Popup';
import Spinner from '../../../components/Spinner/Spinner';
import { authTokens } from '../../../shared/js/authTokens';
import axios from '../../../shared/js/axiosRESTInstance';
import { credentials } from '../../../shared/js/credentials';
import graphql from '../../../shared/js/graphql';
import { session } from '../../../shared/js/session';
import classes from './Register.scss';

class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userName: '',
            email: '',
            password: '',
            passwordConfirm: '',
            isLoading: false,
        };
    }

    onFormSubmit = e => {
        e.preventDefault();
        const { userName, email, password, passwordConfirm } = this.state;

        if (password != passwordConfirm) {
            this.setState({
                errors: [{ message: 'Passwords do not match.' }],
            });

            return;
        }

        this.setState({
            isLoading: true,
        });

        axios
            .post('/auth/register', {
                userName,
                email,
                password,
                passwordConfirm,
            })
            .then(({ data }) => {
                const { onLogin } = this.props;

                this.setState({
                    isLoading: false,
                });

                const { authToken, refreshToken, username } = data;

                authTokens.set(authToken, refreshToken);
                credentials.set(username);
                session.set();

                onLogin();
            })
            .catch(({ response }) => {
                this.setState({
                    isLoading: false,
                    errors: response.data.errors,
                });
            });
    };

    onErrorDismiss = () =>
        this.setState({
            errors: null,
        });

    render() {
        const {
            userName,
            email,
            password,
            passwordConfirm,
            isLoading,
            errors,
        } = this.state;

        const spinner = isLoading ? (
            <Backdrop>
                <Spinner />
            </Backdrop>
        ) : null;

        const errorsPopup = errors ? (
            <Popup onDismiss={this.onErrorDismiss} dismissText="Dismiss">
                {errors.map(e => (
                    <ErrorMessage key={e.message}>{e.message}</ErrorMessage>
                ))}
            </Popup>
        ) : null;

        return (
            <>
                <div className={classes.FormWrapper}>
                    <Form onSubmit={this.onFormSubmit}>
                        <h3 className={classes.FormCta}>Register</h3>
                        <FormField
                            name="username"
                            type="text"
                            label="Enter username:"
                            value={userName}
                            onChange={e => {
                                this.setState({
                                    userName: e.target.value,
                                });
                            }}
                        />
                        <FormField
                            name="email"
                            type="text"
                            label="Enter email:"
                            value={email}
                            onChange={e => {
                                this.setState({
                                    email: e.target.value,
                                });
                            }}
                        />
                        <FormField
                            name="password"
                            type="password"
                            label="Enter password:"
                            value={password}
                            onChange={e => {
                                this.setState({
                                    password: e.target.value,
                                });
                            }}
                        />
                        <FormField
                            name="passwordConfirm"
                            type="password"
                            label="Confirm password:"
                            value={passwordConfirm}
                            onChange={e => {
                                this.setState({
                                    passwordConfirm: e.target.value,
                                });
                            }}
                        />
                        <Button>Submit</Button>
                    </Form>
                </div>
                <div className={classes.AuthRedirectWrapper}>
                    <NavLink to="/login">Login</NavLink>
                </div>
                {spinner}
                {errorsPopup}
            </>
        );
    }
}

export default withRouter(Register);
