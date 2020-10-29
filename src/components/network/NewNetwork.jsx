import React from 'react';
import { userActions } from '_actions';
import { useDispatch } from "react-redux";
import loading from 'assets/img/loading.gif';

import {
    toast,
    Bounce
  } from 'react-toastify';

export default function NewNetwork(props)
{
    const loader = <div className="loader"><img alt="loading" src={loading} /></div>;
    const dispatch = useDispatch();
    dispatch(userActions.createActivity());

    toast("Rede criada.", {
        transition: Bounce,
        closeButton: true,
        autoClose: 5000,
        position: 'bottom-right',
        type: 'success'
    });

    return (<div>{loader}</div>);
}