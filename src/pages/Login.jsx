import React, { useState } from 'react';
import { Grid, Hidden, TextField, InputAdornment, IconButton, Button } from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { userActions } from '_actions';
import { Link } from "react-router-dom";

import Unsplash from 'assets/img/connect-unsplash.jpg';
import {Animated} from "react-animated-css";

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
    center: {
        width: '100%',
        textAlign: 'center'
    },
    socialAccess: {
        display: 'inline-block',
        padding: '3px'
    },
    buttonSubmit: {
        borderRadius: '0',
        lineHeight: '45px',
        padding: '0 25px 0 35px',
        fontWeight: 'bold',
        margin: '15px 8px'
    },
    [theme.breakpoints.down('sm')]: {
        authBox: {
            margin: '80px 20px 10px 20px',
        }
    },
    [theme.breakpoints.up('md')]: {
        authBox: {
            margin: '0 100px',
        }
    },
    margin: {
      margin: theme.spacing(1),
    },
    marginBox: {
        margin: 8,
    },
    textField: {
      flexBasis: 280,
    },
    featured: {
        background: "url("+Unsplash+")",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
    },
    registerInfo: {
        position: 'absolute',
        top: 25,
        right: 25,
    },
    button: {
        borderRadius: 30,
    }
  });

function Login(props) {

    const [animated, toggleAnimated] = useState(false);

    const [userConf, setUserConf] = useState({
        password: '',
        email: '',
        showPassword: false,
    });
    

    const handleSubmit = (e) => {
        e.preventDefault();
        
        toggleAnimated(false);
        setUserConf({...userConf, submitted: true});

        const { dispatch } = props;
        if (userConf.email && userConf.password) {
            dispatch(userActions.login(userConf.email, userConf.password));
            setTimeout(() => {
                toggleAnimated(true);
            }, 100);
        }
    };
    
    const handleChange = prop => event => {
        setUserConf({...userConf, [prop]: event.target.value});
    };

    const toggleShowPassword = () => {
        setUserConf({...userConf, showPassword: !userConf.showPassword});
    };

    const { classes, message, type } = props;
    
    if (localStorage.getItem("user")) {
        return <Redirect to='/painel/cursos' />
        }
        
    return (
        <div className={classes.container}>
            <Grid container >
                <Hidden smDown>
                    <Grid className={classes.featured} xs={12} item md={6}  style={{alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column'}}>
                        
                    </Grid>
                </Hidden>
                <Grid style={{alignSelf:'center', padding: 15}} sm={12} xs={12} item md={6}>
                <form onSubmit={handleSubmit}>
                    <div className={classes.registerInfo}>
                        <Hidden smDown>
                        <span style={{marginRight: 10}}>Não possuí uma conta?</span>
                        </Hidden>
                        <Link to="/registro">
                        <Button variant="outlined" className={classes.button}>Registre-se</Button>
                        </Link>
                    </div>
                    <div className={classes.authBox}>

                    <div className={classes.marginBox}>
                        <h2 style={{color: '#544f4f'}}>Acesse sua conta</h2>
                        <p>Preencha com suas credenciais</p>
                    </div>
                        <TextField
                            fullWidth
                            id="outlined-adornment-email"
                            className={classNames(classes.margin, classes.textField)}
                            variant="filled"
                            type={'text'}
                            label="Email"
                            value={userConf.email}
                            onChange={handleChange('email')}
                            />
                        <TextField 
                            fullWidth
                            id="outlined-adornment-password"
                            className={classNames(classes.margin, classes.textField)}
                            variant="filled"
                            type={userConf.showPassword ? 'text' : 'password'}
                            label="Password"
                            value={userConf.password}
                            onChange={handleChange('password')}
                            InputProps={{
                                endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                    aria-label="Toggle password visibility"
                                    onClick={toggleShowPassword}
                                    >
                                    {userConf.showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                                ),
                            }}
                            />
                            {message &&
                                <Animated animationIn="shake" isVisible={animated} animationOutDuration={0}>
                                    <div className={`alert ${type}`}>{message}</div>
                                </Animated>
                            }
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disableRipple
                            className={classNames(classes.buttonSubmit)}
                            >
                            Acessar
                        </Button>
                    </div>
                </form>
                </Grid>
            </Grid>
        </div>
    );
}

  
  function mapStateToProps(state) {
      const { loggingIn } = state.authentication;
    const { message, type } = state.alert;
    
      return {
          loggingIn,
          message,
          type
          
      };
  }
  
  const connectedLogin = connect(mapStateToProps)(Login);
  
  export default withStyles(styles)(connectedLogin);