import React, { Component } from 'react';
import './App.css';
import { routesList, privateRoutesList } from "routes/index.jsx";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { PrivateRoute } from "components/routes/PrivateRoute.jsx";
import { history } from '_helpers';

class App extends Component {
  render() {
  return (
    <Router history={history}>
        <Switch>

            {routesList.map((prop, key) => {
              return <Route exact path={prop.path}  component={prop.component} key={key} />;
            })}
            
            {privateRoutesList.map((prop, key) => {
              return <PrivateRoute path={prop.path} component={prop.component} key={key} />;
            })}

            <Redirect exact from='*' to='/login' />
             
        </Switch>
    </ Router>
  );
}
}
export default App;
