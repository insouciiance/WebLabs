import React from 'react';

import classes from './Backdrop.scss';

const Backdrop = props => {
    const { onClick } = props;

    return <div className={classes.Backdrop} onClick={onClick} />;
};

export default Backdrop;
