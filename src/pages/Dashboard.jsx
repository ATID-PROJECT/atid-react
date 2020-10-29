import React, {Fragment, Component} from 'react';

import AppHeader from 'layout/AppHeader.jsx';
import AppSidebar from 'layout/AppSidebar.jsx';

import { Switch, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';

import { internRoutes } from "routes/dashboardRoutes.jsx";

const renderMergedProps = (component, ...rest) => {
    const finalProps = Object.assign({}, ...rest); 
    return (
      React.createElement(component, finalProps)
    );
  }

const PropsRoute = ({ component, ...rest }) => {
  return (
    <Route {...rest} render={routeProps => {
      return renderMergedProps(component, routeProps, rest);
    }}/>
  );
}

class Dashboard extends Component {
    render() {
        return(
        <Fragment>
            <AppHeader/>
            <div className="app-main">
                <AppSidebar/>
                <div className="app-main__outer">
                    <div className="app-main__inner">
                        <Switch>
                        {internRoutes.map((prop, key) => {
                          if(prop.exact){
                            return <PropsRoute exact path={prop.path}  component={prop.component} key={key} />;
                          }
                          else{
                            return <PropsRoute path={prop.path}  component={prop.component} key={key} />;
                          }
                          
                        })}
                        </Switch>
                    </div>
                </div>
            </div>
            <ToastContainer/>
        </Fragment>
    )};
}

export default Dashboard;