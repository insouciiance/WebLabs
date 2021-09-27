import React, { Component } from 'react';
import Button from '../../components/UI/Button/Button';
import InputElement from './InputElement/InputElement';

import classes from './MailForm.scss';
import TextArea from './TextArea/TextArea';

class MailForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mailAddress: null,
            authorName: null,
            text: null,
        };
    }

    onChange(name, event) {
        const { [name]: currentValue } = this.state;
        if (currentValue !== event.target.value) {
            this.setState({
                [name]: event.target.value,
            });
        }
    }

    render() {
        const { onSubmit } = this.props;
        const { mailAddress, authorName, text } = this.state;

        return (
            <div className={classes.FormWrapper}>
                <h2 className={classes.CallToAction}>Start mailing now</h2>
                <form
                    onSubmit={onSubmit?.bind(this, {
                        mailAddress,
                        authorName,
                        text,
                    })}
                    action="#"
                    method="post"
                >
                    <InputElement
                        labelText="Enter mailing address:"
                        type="text"
                        name="mailAddress"
                        onChange={this.onChange.bind(this, 'mailAddress')}
                    />
                    <InputElement
                        labelText="Enter your name:"
                        type="text"
                        name="authorName"
                        onChange={this.onChange.bind(this, 'authorName')}
                    />
                    <TextArea
                        labelText="Enter your message:"
                        name="text"
                        onChange={this.onChange.bind(this, 'text')}
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
