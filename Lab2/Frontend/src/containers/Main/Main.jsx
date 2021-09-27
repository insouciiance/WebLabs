import React, { Component } from 'react';
import axios from '../../axiosInstance';
import Popup from '../../components/UI/Popup/Popup';

import Spinner from '../../components/UI/Spinner/Spinner';
import MailForm from '../MailForm/MailForm';
import classes from './Main.scss';

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            emailResultPopupActive: false,
            isRequestPending: false,
            requestResult: null,
        };
    }

    onSubmit = (data, event) => {
        event.preventDefault();
        this.setState({
            isRequestPending: true,
        });
        axios
            .post('', data)
            .then(res => {
                this.setState({
                    isRequestPending: false,
                    emailResultPopupActive: true,
                    requestResult: res.data,
                });
            })
            .catch(error => {
                this.setState({
                    isRequestPending: false,
                    emailResultPopupActive: true,
                    requestResult: error.response.data,
                });
            });
    };

    onEmailPopupDismiss = () => {
        this.setState({
            emailResultPopupActive: false,
        });
    };

    render() {
        const { isRequestPending, emailResultPopupActive, requestResult } =
            this.state;

        return (
            <>
                <div className={classes.MailFormContainer}>
                    <MailForm onSubmit={this.onSubmit}></MailForm>
                </div>
                {isRequestPending ? (
                    <div className={classes.SpinnerContainer}>
                        <Spinner />
                    </div>
                ) : null}
                {emailResultPopupActive ? (
                    <Popup onDismiss={this.onEmailPopupDismiss}>
                        <p>{requestResult}</p>
                    </Popup>
                ) : null}
            </>
        );
    }
}

export default Main;
