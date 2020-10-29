import React, {Fragment} from 'react';

import {
    DropdownToggle, DropdownMenu,
    Nav, NavItem, NavLink,
    UncontrolledButtonDropdown
} from 'reactstrap';

import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
    toast,
    Bounce
} from 'react-toastify';

import { history } from '_helpers';
import { userActions } from '_actions';
import {
    faAngleDown

} from '@fortawesome/free-solid-svg-icons';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import avatar1 from 'assets/utils/images/avatars/1.jpg';

class UserBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: false,
        };

        this.logoutUser = this.logoutUser.bind(this);
        this.user = JSON.parse( localStorage.getItem('user') );
    }

    logoutUser() {
        this.props.dispatch(userActions.logout());
        history.push('/login');
      }

    notify2 = () => this.toastId = toast("You don't have any new items in your calendar for today! Go out and play!", {
        transition: Bounce,
        closeButton: true,
        autoClose: 5000,
        position: 'bottom-center',
        type: 'success'
    });


    render() {

        return (
            <Fragment>
                <div className="header-btn-lg pr-0">
                    <div className="widget-content p-0">
                        <div className="widget-content-wrapper">
                            <div className="widget-content-left">
                                <UncontrolledButtonDropdown>
                                    <DropdownToggle color="link" className="p-0">
                                        <img width={42} className="rounded-circle" src={avatar1} alt=""/>
                                        <FontAwesomeIcon className="ml-2 opacity-8" icon={faAngleDown}/>
                                    </DropdownToggle>
                                    <DropdownMenu right className="rm-pointers dropdown-menu-lg">
                                        <Nav vertical>
                                            <NavItem>
                                                <NavLink href="/painel/preferencias">
                                                    Configurações
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink onClick={this.logoutUser}>
                                                    Sair
                                                </NavLink>
                                            </NavItem>
                                        </Nav>
                                    </DropdownMenu>
                                </UncontrolledButtonDropdown>
                            </div>
                            <div className="widget-content-left  ml-3 header-user-info">
                                <div className="widget-heading">
                                    { this.user.username }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}


function mapStateToProps(state) {
    const { loggingIn } = state.authentication;
    return {
        loggingIn
    };
}

const connectedLogout= connect(mapStateToProps)(UserBox);

export default withRouter(connectedLogout);

