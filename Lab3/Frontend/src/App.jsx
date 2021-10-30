import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import Register from './containers/Auth/Register/Register';
import Home from './containers/Home/Home';
import Layout from './hoc/Layout/Layout';

export default function App() {
    return (
        <Layout>
            <Switch>
                <Route path="/home" component={Home} exact />
                <Route path="/register" component={Register} exact />
                <Redirect to="/home" />
            </Switch>
        </Layout>
    );
}
