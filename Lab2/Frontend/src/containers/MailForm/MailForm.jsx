import React, { Component } from 'react';
import Button from '../../components/UI/Button/Button';
import InputElement from './InputElement/InputElement';

import classes from './MailForm.scss';
import TextArea from './TextArea/TextArea';

class MailForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mailAddress: '',
            authorName: '',
            text: '',
        };
    }

    onChange = (event, name) => {
        const { [name]: currentValue } = this.state;
        if (currentValue !== event.target.value) {
            this.setState({
                [name]: event.target.value,
            });
        }
    };

    onSubmit = event => {
        event.preventDefault();

        const { onSubmit: onPropsSubmit } = this.props;
        const { mailAddress, authorName, text } = this.state;

        onPropsSubmit({ mailAddress, authorName, text }, () => {
            this.setState({
                mailAddress: '',
                authorName: '',
                text: '',
            });
        });
    };

    render() {
        const { mailAddress, authorName, text } = this.state;

        return (
            <div className={classes.FormWrapper}>
                <h2 className={classes.CallToAction}>Start mailing now</h2>
                <form onSubmit={this.onSubmit} action="#" method="post">
                    <InputElement
                        labelText="Enter mailing address:"
                        type="text"
                        name="mailAddress"
                        onChange={e => this.onChange(e, 'mailAddress')}
                        value={mailAddress}
                    />
                    <InputElement
                        labelText="Enter your name:"
                        type="text"
                        name="authorName"
                        onChange={e => this.onChange(e, 'authorName')}
                        value={authorName}
                    />
                    <TextArea
                        labelText="Enter your message:"
                        name="text"
                        onChange={e => this.onChange(e, 'text')}
                        value={text}
                    />
                    <div className={classes.ButtonContainer}>
                        <Button type="submit" name="submit">
                            Submit
                        </Button>
                    </div>
                </form>
            </div>
        );
    }
}

export default MailForm;
