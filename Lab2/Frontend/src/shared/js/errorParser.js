const parseResponseErrors = response => {
    let errors = {};

    if (response.status === 429) {
        errors = {
            CallQuotaExceeded: response.data,
        };
    } else {
        errors = response.data.errors;
    }

    return errors;
};

export default parseResponseErrors;
