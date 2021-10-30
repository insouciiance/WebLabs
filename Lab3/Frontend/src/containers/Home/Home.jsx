import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { authToken } from '../../shared/js/authToken';

class Home extends Component {
    constructor(props) {
        super(props);

        const { history } = this.props;

        if (!authToken.get()) {
            history.push('/register');
        }
    }

    render() {
        return <div>Hello</div>;
    }
}

export default withRouter(Home);
