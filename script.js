'use strict';

const obj = {
    age: 13,
    name: 'Skalnik',
};

const logger = o => {
    for (const prop in o) {
        console.log(`${prop}: ${o[prop]}`);
    }
};

logger(obj);
