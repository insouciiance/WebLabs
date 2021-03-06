import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import Login from './containers/Auth/Login/Login';
import Register from './containers/Auth/Register/Register';
import Home from './containers/Home/Home';
import Layout from './hoc/Layout/Layout';
import { authTokens } from './shared/js/authTokens';
import axios from './shared/js/axiosRESTInstance';
import { credentials } from './shared/js/credentials';
import { session } from './shared/js/session';

class App extends Component {
    constructor(props) {
        super(props);

        const isTokenValid = authTokens.valid();

        this.state = {
            isAuthenticated: isTokenValid,
        };

        if (!isTokenValid) {
            authTokens.reset();
            credentials.reset();
            session.reset();
            return;
        }

        session.set();
    }

    onLogout = () => {
        if (!authTokens.exists()) {
            this.setState({ isAuthenticated: false });
            return;
        }

        axios.post('/auth/logout').then(() => {
            authTokens.reset();
            credentials.reset();
            session.reset();
            this.setState({ isAuthenticated: false });
        });
    };

    render() {
        const { isAuthenticated } = this.state;

        return (
            <Layout onLogout={isAuthenticated ? this.onLogout : null}>
                {isAuthenticated ? (
                    <Switch>
                        <Route path="/home" exact>
                            <Home />
                        </Route>
                        <Redirect to="/home" />
                    </Switch>
                ) : (
                    <Switch>
                        <Route path="/register" exact>
                            <Register
                                onLogin={() =>
                                    this.setState({ isAuthenticated: true })
                                }
                            />
                        </Route>
                        <Route path="/login" exact>
                            <Login
                                onLogin={() =>
                                    this.setState({ isAuthenticated: true })
                                }
                            />
                        </Route>
                        <Redirect to="/login" />
                    </Switch>
                )}
            </Layout>
        );
    }
}

export default App;
