import { authHeader } from '../_helpers';
import $ from 'jquery'; 

export const userService = {
    login,
    register,
    createActivity,
    saveSubActivity,
    logout,
    getAll,
    handleResponse,
    sendGETRequest,
    sendPOSTRequest,
    sendRequest,    
    sendDELETERequest,
    sendPUTRequest,
    duplicateActivity,
};

function sendGETRequest (url, params) {
    let user = JSON.parse(localStorage.getItem('user'));
    const arg_length = arguments.length;
    const requestOptions = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + user.token,
        }
    };

    let func = arguments[2];
    let func2 = arguments[3];

  return fetch(`${process.env.REACT_APP_API_URL}${url}?`+$.param( params ), requestOptions)
      .then(userService.handleResponse)
      .then(response => {
          if (arg_length > 2)
          {
              func(response);
          }
          return response;
      }).catch(function(error) { 
        if (arg_length > 3) 
        { 
            func2(error);
        }
      });
}

function sendPOSTRequest (url, params) {
  let user = JSON.parse(localStorage.getItem('user'));
  const arg_length = arguments.length;
  const requestOptions = {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + user.token,
      },
      body: JSON.stringify( params )
  };

    let func = arguments[2];
    let func2 = arguments[3];

  return fetch(`${process.env.REACT_APP_API_URL}${url}`, requestOptions)
      .then(userService.handleResponse)
      .then(response => {
            if (arguments.length !== 2)
            {
                func(response);
            }
          return response;
    }).catch(function(error) { 
        if (arg_length > 3) 
        { 
            func2(error);
        }
      });
}

function sendRequest (url, option, params) {
    let user = JSON.parse(localStorage.getItem('user'));
    const requestOptions = {
        method: option,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + user.token,
        },
        body: JSON.stringify( params )
    };
    return fetch(`${process.env.REACT_APP_API_URL}${url}`, requestOptions)
        .then(userService.handleResponse)
        .then(response => {
              if (arguments.length !== 3)
              {
                  let func = arguments[3];
                  func(response);
              }
            return response;
        });
  }

function sendPUTRequest (url, params) {
    let user = JSON.parse(localStorage.getItem('user'));
    const requestOptions = {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + user.token,
        },
        body: JSON.stringify( params )
    };
    return fetch(`${process.env.REACT_APP_API_URL}`, requestOptions)
        .then(userService.handleResponse)
        .then(response => {
              if (arguments.length !== 2)
              {
                  let func = arguments[2];
                  func(response);
              }
            return response;
        });
}

function sendDELETERequest (url, params) {
    let user = JSON.parse(localStorage.getItem('user'));
    const requestOptions = {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + user.token,
        },
        body: JSON.stringify( params )
    };
    return fetch(`${process.env.REACT_APP_API_URL}${url}`, requestOptions)
        .then(userService.handleResponse)
        .then(response => {
              if (arguments.length !== 2)
              {
                  let func = arguments[2];
                  func(response);
              }
            return response;
        });
}

function saveSubActivity(id_activity, id_subnetwork , all_data) {
    let user = JSON.parse(localStorage.getItem('user'));
    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + user.token,
        },
        body: JSON.stringify( { id_activity: id_activity, id_subnetwork: id_subnetwork, data: all_data} )
    };
    return fetch(`${process.env.REACT_APP_API_URL}/users/activity/subnetwork/save`, requestOptions)
        .then(handleResponse)
        .then(response => {
            return response;
        });
}

function createActivity() {
    let user = JSON.parse(localStorage.getItem('user'));
    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + user.token,
        },
        body: JSON.stringify( {email: user.username} )
    };
    return fetch(`${process.env.REACT_APP_API_URL}/users/activity/create`, requestOptions)
        .then(handleResponse)
        .then(response => {
            return response;
        });
}

function duplicateActivity( network_id ) {
    let user = JSON.parse(localStorage.getItem('user'));
    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + user.token,
        },
        body: JSON.stringify( {email: user.username} )
    };
    return fetch(`${process.env.REACT_APP_API_URL}/users/activity/${network_id}/duplicate`, requestOptions)
        .then(handleResponse)
        .then(response => {
            return response;
        });
}

function register(first_name, last_name, email, password) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({ email, first_name, last_name, password })
    };
    return fetch(`${process.env.REACT_APP_API_URL}/users/register`, requestOptions)
        .then(handleResponse)
        .then(user => {
            // login successful if there's a jwt token in the response
            if (user.token) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
            }
            
            return user;
        });
}

function login(email, password) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({ email, password })
    };
    return fetch(`${process.env.REACT_APP_API_URL}/users/login`, requestOptions)
        .then(handleResponse)
        .then(user => {
            // login successful if there's a jwt token in the response
            if (user.token) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
            }
            
            return user;
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}

function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${process.env.REACT_APP_API_URL}/users`, requestOptions).then(handleResponse);
}

function handleResponse(response) {
    return response.json().then(data => {
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
                window.location.reload(true);
            }

            const error = (data && data.error) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}