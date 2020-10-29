import { userConstants } from '../_constants';
import { userService } from '../_services';
import { alertActions } from './';
import { history } from '../_helpers';

export const userActions = {
    login,
    register,
    createActivity,
    logout,
    duplicateActivity,
    getAll
};

function duplicateActivity( network_id ) {
    return dispatch => {
        userService.duplicateActivity( network_id )
            .then(
                response => { 
                    history.push('/painel/cursos/editar/'+response.name);
                },
                error => {
                    console.log(error)
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function failure(error) { return { type: userConstants.CREATE_ACTIVITY_FAILURE, error } }
}

function createActivity() {
    return dispatch => {
        userService.createActivity()
            .then(
                response => { 
                    history.push('/painel/cursos/editar/'+response.name);
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function failure(error) { return { type: userConstants.CREATE_ACTIVITY_FAILURE, error } }
}

function login(username, password) {
    return dispatch => {
        dispatch(request({ username }));

        userService.login(username, password)
            .then(
                user => { 
                    dispatch(success(user));
                    history.push('/painel/cursos');
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(user) { return { type: userConstants.LOGIN_REQUEST, user } }
    function success(user) { return { type: userConstants.LOGIN_SUCCESS, user } }
    function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }
}

function register(first_name, last_name, email, password) {
    return dispatch => {
        dispatch(request({ email }));

        userService.register(first_name, last_name, email, password)
            .then(
                user => { 
                    dispatch(success(user));
                    history.push('/login');
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(user) { return { type: userConstants.LOGIN_REQUEST, user } }
    function success(user) { return { type: userConstants.LOGIN_SUCCESS, user } }
    function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }
}

function logout() {
    userService.logout();
    return { type: userConstants.LOGOUT };
}

function getAll() {
    return dispatch => {
        dispatch(request());

        userService.getAll()
            .then(
                users => dispatch(success(users)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: userConstants.GETALL_REQUEST } }
    function success(users) { return { type: userConstants.GETALL_SUCCESS, users } }
    function failure(error) { return { type: userConstants.GETALL_FAILURE, error } }
}