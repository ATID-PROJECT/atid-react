import React, { Component } from 'react';
import { Grid, Hidden, TextField, InputAdornment, IconButton, Button } from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { Link } from "react-router-dom";
import Unsplash from 'assets/img/workflow.jpg';

import { Redirect } from 'react-router-dom';
import { userActions } from '_actions';

const styles = theme => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    socialicons:{
        listStyleType: 'none',
        paddingLeft: '0',
    },
    imgIcon: {
        width: '40px',
    },
    socialAccess: {
        display: 'inline-block',
        padding: '3px'
    },
    buttonSubmit: {
        borderRadius: '100px',
        lineHeight: '45px',
        padding: '0 55px',
        margin: '15px 8px'
    },
    [theme.breakpoints.down('sm')]: {
        authBox: {
            margin: '80px 20px 10px 20px',
        },
        joinField: {
            paddingBottom: '0 !important',
        },
        joinField2: {
            paddingTop: '0 !important',
        }
    },
    [theme.breakpoints.up('md')]: {
        authBox: {
            margin: '0 100px',
        }
    },
    margin: {
      margin: theme.spacing.unit,
    },
    marginBox: {
        margin: 8,
    },
    textField: {
      flexBasis: 280,
    },
    featured: {
        background: "linear-gradient(0deg, rgba(37, 40, 57, 0.9), rgba(37, 40, 57, 0.9)),url("+Unsplash+")",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
    },
    RegistroInfo: {
        position: 'absolute',
        top: 25,
        right: 25,
    },
    button: {
        borderRadius: 30,
    }
  });

class Registro extends Component {
    state = {
        password: '',
        email: '',
        showPassword: false,
    }
    
    handleSubmit = (e) => {
        e.preventDefault();
        
        this.setState({ submitted: true });
        const { email, password, first_name, last_name } = this.state;
        const { dispatch } = this.props;
        if (email && password && first_name && last_name) {
            dispatch(userActions.register(first_name, last_name, email, password));
        }
    };
    
    handleChange = prop => event => {
        this.setState({ [prop]: event.target.value });
    };

    handleClickShowPassword = () => {

        this.setState(state => ({ showPassword: !state.showPassword }));
    };


    render() {
        const { classes } = this.props;
        if (localStorage.getItem("user")) {
            return <Redirect to='/painel' />
          }
        return (
            <div className={classes.container}>
                <Grid container >
                    <Hidden smDown>
                        <Grid className={classes.featured} xs={12} item md={6} >

                        </Grid>
                    </Hidden>
                    <Grid style={{alignSelf:'center',padding: 15}} sm={12} xs={12} item md={6}>
                        <div className={classes.RegistroInfo}>
                             <Hidden smDown>
                                <span style={{marginRight: 10}}>Possuí um cadastrado?</span>
                            </Hidden>
                            <Link to="/login">
                            <Button variant="outlined" className={classes.button}>FAZER Login</Button>
                            </Link>
                        </div>
                        <div className={classes.authBox}>

                        <div className={classes.marginBox}>
                            <h2 style={{color: '#544f4f'}}>Registre-se</h2>
                            <p>Preencha todos os campos obrigatórios</p>
                        </div>
                        <form onSubmit={this.handleSubmit}>
                        <Grid container spacing={24}>
                            <Grid xs={12} item md={6} className={classes.joinField}>
                                <TextField
                                    required
                                    fullWidth
                                    id="outlined-adornment-first_name"
                                    className={classNames(classes.margin, classes.textField)}
                                    variant="outlined"
                                    type={'text'}
                                    label="Nome"
                                    value={this.state.first_name}
                                    onChange={this.handleChange('first_name')}
                                    />
                            </Grid>
                            <Grid xs={12} item md={6} className={classes.joinField2}>
                                <TextField
                                    required
                                    fullWidth
                                    id="outlined-adornment-last_name"
                                    className={classNames(classes.margin, classes.textField)}
                                    variant="outlined"
                                    type={'text'}
                                    label="Sobrenome"
                                    value={this.state.last_name}
                                    onChange={this.handleChange('last_name')}
                                    />
                            </Grid>
                        </Grid>
                            <TextField
                                required
                                fullWidth
                                id="outlined-adornment-email"
                                className={classNames(classes.margin, classes.textField)}
                                variant="outlined"
                                type={'text'}
                                label="Email"
                                value={this.state.email}
                                onChange={this.handleChange('email')}
                                />
                            <TextField 
                                required
                                inputProps={{
                                    minLength: 6
                                  }}
                                fullWidth
                                id="outlined-adornment-password"
                                className={classNames(classes.margin, classes.textField)}
                                variant="outlined"
                                type={this.state.showPassword ? 'text' : 'password'}
                                label="Password"
                                value={this.state.password}
                                onChange={this.handleChange('password')}
                                InputProps={{
                                    endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                        aria-label="Toggle password visibility"
                                        onClick={this.handleClickShowPassword}
                                        >
                                        {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                    ),
                                }}
                                />
                            <Button
                                fullWidth
                                type="submit"
                                variant="contained"
                                color="primary"
                                disableRipple
                                className={classNames(classes.buttonSubmit)}
                            >
                                Registro
                            </Button>
                            
                            </form>
                        </div>
                    
                    </Grid>
                </Grid>
            </div>
        );
    }
}


Registro.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
  function mapStateToProps(state) {
      const { loggingIn } = state.authentication;
      return {
          loggingIn
      };
  }
  
  const connectedLogin = connect(mapStateToProps)(Registro);
  
  export default withStyles(styles)(connectedLogin);