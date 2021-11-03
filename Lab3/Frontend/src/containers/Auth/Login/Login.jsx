import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

import Button from '../../../components/Button/Button';
import Form from '../../../components/Form/Form';
import FormField from '../../../components/Form/FormField/FormField';
import { authToken } from '../../../shared/js/authToken';
import axios from '../../../shared/js/axiosInstance';
import graphql from '../../../shared/js/graphql';

import classes from './Login.scss';

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userName: '',
            password: '',
        };
    }

    onFormSubmit = e => {
        e.preventDefault();
        const { userName, password } = this.state;

        axios
            .post('/', {
                query: graphql.login(userName, password),
            })
            .then(res => {
                const { onLogin } = this.props;

                console.log(res);
                if (!res.data.errors) {
                    const { jwtToken, expires } = res.data.data.login;

                    authToken.set(jwtToken, expires);

                    onLogin();
                }
            });
    };

    render() {
        const { userName, password } = this.state;

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
            </>
        );
    }
}

export default withRouter(Login);
