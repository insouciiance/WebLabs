import React, { Component } from 'react';
import Button from '../../components/UI/Button/Button';
import InputElement from './InputElement/InputElement';

import classes from './MailForm.scss';
import TextArea from './TextArea/TextArea';

class MailForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: null,
            name: null,
            text: null,
        };
    }

    onChange(name, event) {
        if (name !== this.state[name]) {
            this.setState({
                [name]: event.target.value,
            });
        }
    }

    render() {
        return (
            <div className={classes.FormWrapper}>
                <h2 className={classes.CallToAction}>Start mailing now</h2>
                <form action="#" method="post">
                    <InputElement
                        labelText="Enter mailing address:"
                        type="text"
                        name="email"
                        onChange={this.onChange.bind(this, 'email')}
                    />
                    <InputElement
                        labelText="Enter your name:"
                        type="text"
                        name="name"
                        onChange={this.onChange.bind(this, 'name')}
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
