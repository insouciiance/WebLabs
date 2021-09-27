import React, { Component } from 'react';
import MailForm from '../MailForm/MailForm';

import classes from './Main.scss';

class Main extends Component {
    render() {
        return (
            <>
                <div className={classes.MailFormContainer}>
                    <MailForm></MailForm>
                </div>
            </>
        );
    }
}

export default Main;
