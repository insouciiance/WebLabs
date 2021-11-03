import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';

import Button from '../../../components/Button/Button';
import Form from '../../../components/Form/Form';
import FormField from '../../../components/Form/FormField/FormField';
import { authToken } from '../../../shared/js/authToken';
import axios from '../../../shared/js/axiosInstance';
import graphql from '../../../shared/js/graphql';

import classes from './Register.scss';

class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userName: '',
            email: '',
            password: '',
            passwordConfirm: '',
        };
    }

    onFormSubmit = e => {
        e.preventDefault();
        const { userName, email, password, passwordConfirm } = this.state;

        axios
            .post('/', {
                query: graphql.register(
                    userName,
                    email,
                    password,
                    passwordConfirm,
                ),
            })
            .then(res => {
                const { onLogin } = this.props;

                console.log(res);
                if (!res.data.errors) {
                    const { jwtToken, expires } = res.data.data.register;

                    authToken.set(jwtToken, expires);

                    onLogin();
                }
            });
    };

    render() {
        const { userName, email, password, passwordConfirm } = this.state;

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
            </>
        );
    }
}

export default withRouter(Register);
