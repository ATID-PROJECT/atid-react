import { alertConstants } from '../_constants';

function success(message) {
    return { type: alertConstants.SUCCESS, message };
}

function error(message) {
    return { type: alertConstants.ERROR, message };
}

function clear() {
    return { type: alertConstants.CLEAR };
}

const enqueueSnackbar = notification => ({
    type: alertConstants.ENQUEUE,
    notification: {
        key: new Date().getTime() + Math.random(),
        ...notification,
    },
});

const removeSnackbar = key => ({
    type: alertConstants.REMOVE,
    key,
});

export const alertActions = {
    success,
    error,
    clear,
    enqueueSnackbar,
    removeSnackbar,
};