import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import AccountBoxIcon from '@material-ui/icons/AccountBox';
import DeleteIcon from '@material-ui/icons/Delete';
import { userService } from "_services";
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';

import { Button, Grid } from '@material-ui/core';
import {
  toast,
  Bounce
} from 'react-toastify';

const useStyles = makeStyles(theme => ({
  nested: {
    paddingLeft: theme.spacing(4),
  },
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
    fontSize: '15px',
    padding: '6px 5px',
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
  errorMessage: {
    margin: 0,
    paddingTop: 15,
  }
}));

export default function SharedPannel(props) {
  const classes = useStyles();
  const [users, addUser] = React.useState([]);
  const [values, setValues] = React.useState({
    email: '',
    hasLoaded: false
  });

  if (!values.hasLoaded) {
    setValues({ ...values, hasLoaded: true });

    userService.sendGETRequest("/users/share", {
      network: props.network
    }, function (response) {
      addUser(response);
    });
  }

  const addUserToList = () => {
    userService.sendPOSTRequest("/users/share", {
      network: props.network,
      email: values.email,
    }, function (response) {
      setValues({ ...values, hasLoaded: false });

      toast('Usuário adicionado', {
        transition: Bounce,
        closeButton: true,
        autoClose: 5000,
        position: 'bottom-right',
        type: 'success'
      });

    }, function (error) {

      toast(error, {
        transition: Bounce,
        closeButton: true,
        autoClose: 5000,
        position: 'bottom-right',
        type: 'error'
      });
    });
  }

  const unshare = (email) => {
    userService.sendDELETERequest("/users/share", {
      network: props.network,
      email: email,
    }, function (response) {
      setValues({ ...values, hasLoaded: false });
    });
  }

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  return (
    <Grid container>
      <Paper className={classes.root}>
        <InputBase
          className={classes.input}
          placeholder="Email de usuário"
          value={values.email}
          onChange={handleChange('email')}
          inputProps={{ 'aria-label': 'Email de usuário' }}
        />
        <Button onClick={addUserToList} variant="contained" color="primary">Adicionar Usuário</Button>
      </Paper>

      <Grid item xs={12}>
        <p style={{ margin: 0, padding: '18px 15px 0 20px' }}>Usuários com permissões</p>
      </Grid>

      <Grid item xs={12} style={{ marginTop: 15 }}>
        <List
          component="nav"
          aria-labelledby="nested-list-subheader"
          className={classes.root}
        >
          {users.map((value, index) => {
            return <ListItem key={index} button>
              <ListItemIcon>
                <AccountBoxIcon />
              </ListItemIcon>
              <ListItemText primary={value['user']['email']} />
              <Button onClick={() => unshare(value['user']['email'])}><DeleteIcon /></Button>
            </ListItem>
          })}
          {users.length === 0 && <Button>Nenhum usuário adicionado.</Button>}
        </List>
      </Grid>
    </Grid>
  );
}