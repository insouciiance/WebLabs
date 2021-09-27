import React, { Component } from 'react';
import axios from '../../axiosInstance';

import MailForm from '../MailForm/MailForm';
import classes from './Main.scss';

class Main extends Component {
    onSubmit(data, event) {
        event.preventDefault();
        axios.post('', data);
    }

    render() {
        return (
            <>
                <div className={classes.MailFormContainer}>
                    <MailForm onSubmit={this.onSubmit}></MailForm>
                </div>
            </>
        );
    }
}

export default Main;
