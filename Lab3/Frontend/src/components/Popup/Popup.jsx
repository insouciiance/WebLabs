import React from 'react';

import Backdrop from '../Backdrop/Backdrop';
import Button from '../Button/Button';
import classes from './Popup.scss';

export default function Popup(props) {
    const { children, onDismiss, dismissText } = props;

    const dismissButton = dismissText ? (
        <div className={classes.DismissButtonWrapper}>
            <Button onClick={onDismiss}>{dismissText}</Button>
        </div>
    ) : null;

    return (
        <Backdrop onDismiss={onDismiss}>
            <div
                className={classes.PopupContainer}
                onClick={e => e.stopPropagation()}>
                {children}
                {dismissButton}
            </div>
        </Backdrop>
    );
}
