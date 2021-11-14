import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import Backdrop from '../../../components/Backdrop/Backdrop';

import Button from '../../../components/Button/Button';
import ErrorMessage from '../../../components/ErrorMessage/ErrorMessage';
import Form from '../../../components/Form/Form';
import FormField from '../../../components/Form/FormField/FormField';
import Popup from '../../../components/Popup/Popup';
import Spinner from '../../../components/Spinner/Spinner';
import { authToken } from '../../../shared/js/authToken';
import axios from '../../../shared/js/axiosInstance';
import { credentials } from '../../../shared/js/credentials';
import graphql from '../../../shared/js/graphql';
import { session } from '../../../shared/js/session';
import classes from './Login.scss';

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userName: '',
            password: '',
            isLoading: false,
            errors: null,
        };
    }

    onFormSubmit = e => {
        e.preventDefault();
        const { userName, password } = this.state;

        this.setState({
            isLoading: true,
        });

        axios
            .post('/', {
                query: graphql.login(userName, password),
            })
            .then(res => {
                const { onLogin } = this.props;

                this.setState({
                    isLoading: false,
                });

                console.log(res);

                if (res.data.errors) {
                    this.setState({
                        errors: res.data.errors,
                    });

                    return;
                }

                const { jwtToken, expires, user } = res.data.data.login;

                authToken.set(jwtToken, expires);
                credentials.set(user.userName);
                session.set();

                onLogin();
            });
    };

    onErrorDismiss = () =>
        this.setState({
            errors: null,
        });

    render() {
        const { userName, password, isLoading, errors } = this.state;

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
                        <h3 className={classes.FormCta}>Login</h3>
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
                        <Button>Submit</Button>
                    </Form>
                </div>
                <div className={classes.AuthRedirectWrapper}>
                    <NavLink to="/register">Register</NavLink>
                </div>
                {spinner}
                {errorsPopup}
            </>
        );
    }
}

export default withRouter(Login);
