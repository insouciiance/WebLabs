import React from 'react';

import classes from './Spinner.scss';

export default function Spinner() {
    return <div className={`${classes.Loader} ${classes.QuantumSpinner}`} />;
}
