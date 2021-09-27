import React from 'react';
import Button from '../Button/Button';
import Backdrop from './Backdrop/Backdrop';

import classes from './Popup.scss';

const Popup = props => {
    const { onDismiss, children } = props;

    return (
        <>
            <div className={classes.PopupWrapper}>
                {children}
                <div className={classes.DismissWrapper}>
                    <Button onClick={onDismiss}>Dismiss</Button>
                </div>
            </div>
            <Backdrop onClick={onDismiss} />
        </>
    );
};

export default Popup;
