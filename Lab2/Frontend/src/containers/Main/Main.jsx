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
            mailResult: {
                data: null,
                errors: null,
            },
        };
    }

    onSubmit = (data, resetForm) => {
        this.setState({
            isRequestPending: true,
        });

        axios
            .post('mail', data)
            .then(res => {
                this.setState({
                    isRequestPending: false,
                    emailResultPopupActive: true,
                    mailResult: {
                        data: res.data,
                        errors: null,
                    },
                });

                resetForm();
            })
            .catch(error => {
                this.setState({
                    isRequestPending: false,
                    emailResultPopupActive: true,
                    mailResult: {
                        data: null,
                        errors: error.response.data.errors,
                    },
                });
            });
    };

    onEmailPopupDismiss = () => {
        this.setState({
            emailResultPopupActive: false,
        });
    };

    render() {
        const { isRequestPending, emailResultPopupActive, mailResult } =
            this.state;

        const popupContents = [];

        if (mailResult.data) {
            popupContents.push(
                <p key={mailResult} success="true">
                    {`Successfully mailed ${mailResult.data.mailAddress}`}
                </p>,
            );
        }

        if (mailResult.errors) {
            for (const value of Object.values(mailResult.errors)) {
                popupContents.push(
                    <p key={value} error="true">
                        {value}
                    </p>,
                );
            }
        }

        return (
            <>
                <div className={classes.MailFormContainer}>
                    <MailForm onSubmit={this.onSubmit} />
                </div>
                {isRequestPending ? (
                    <div className={classes.SpinnerContainer}>
                        <Spinner />
                    </div>
                ) : null}
                {emailResultPopupActive ? (
                    <Popup onDismiss={this.onEmailPopupDismiss}>
                        {popupContents}
                    </Popup>
                ) : null}
            </>
        );
    }
}

export default Main;
