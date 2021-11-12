import React from 'react';

import classes from './Spinner.scss';

const Spinner = () => {
    return <div className={`${classes.Loader} ${classes.QuantumSpinner}`} />;
};

export default Spinner;
