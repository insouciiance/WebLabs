import React, { Component } from 'react';

import classes from './Form.scss';

export default class Form extends Component {
    render() {
        const { children, onSubmit } = this.props;

        return (
            <div className={classes.FormWrapper}>
                <form onSubmit={onSubmit}>{children}</form>
            </div>
        );
    }
}
