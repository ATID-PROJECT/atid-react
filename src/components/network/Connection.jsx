import React from "react";
import { dialogActions } from "_actions";

import { makeStyles } from "@material-ui/core/styles";

import { connect } from 'react-redux';
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";

import DialogTitle from "@material-ui/core/DialogTitle";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Button from "@material-ui/core/Button";
import { useTheme } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { userService } from '_services';

import {
  toast,
  Bounce
} from 'react-toastify';

import { useSelector, useDispatch } from "react-redux";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  container: {
    flexGrow: 1,
    position: "relative"
  },
  paper: {
    position: "absolute",
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0
  },
  chip: {
    margin: theme.spacing(0.5, 0.25)
  },
  inputRoot: {
    flexWrap: "wrap"
  },
  inputInput: {
    width: "auto",
    flexGrow: 1
  },
  divider: {
    height: theme.spacing(2)
  }
}));

function Connection(props) {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const dialog = useSelector(state => state.dialog);
  const dispatch = useDispatch();

  const [values, setValues] = React.useState({

  });

  function handleClose() {
    setValues({ ...values, inputValue: "", load: false });
    dispatch(dialogActions.closeDialog("activity_config"));
  }

  const isOpenDialog = function() {
    const result =
      dialog.type === "opened" && dialog.name === "connection_network";

    return result;
  };

  function verifyMoodleToken(){

    userService.sendGETRequest('/moodle/test', {
      url: props.ava_address,
      token: props.access_token,
      network_id: dialog.id_network,
    },
    function(result){
      
      handleClose();
      toast("O ambiente virtual foi conectado a rede.", {
        transition: Bounce,
        closeButton: true,
        autoClose: 4000,
        position: 'bottom-right',
        type: 'success'
    });

      setTimeout(function () {
          
        window.location.reload(true); 
      }, 4000);
    },
    function(error){
      toast("As credenciais fornecidas não são válidas.", {
        transition: Bounce,
        closeButton: true,
        autoClose: 4000,
        position: 'bottom-right',
        type: 'error'
    });
      
    });

  }

  return (
    <div className={classes.root}>
      <Dialog
        fullScreen={fullScreen}
        open={isOpenDialog()}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Configurar a conexão com o ambiente virtual"}
        </DialogTitle>
        <DialogContent>
          <Grid container>
            <Grid item xs={12}>
              <TextField
              fullWidth
              id="standard-address"
              label="Endereço do sistema"
              className={classes.textField}
              value={props.ava_address}
              onChange={props.handleChange('ava_address')}
              margin="normal"
            />
            </Grid>
            <Grid item xs={12}>
              <TextField
              fullWidth
              id="standard-address"
              label="Token de acesso"
              className={classes.textField}
              value={props.access_token}
              onChange={props.handleChange('access_token')}
              margin="normal"
            />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Fechar
          </Button>
          <Button onClick={verifyMoodleToken} color="primary" variant="contained" autoFocus>
              Conectar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const mapStateToProps = state => ({ dialog: state.dialog });

export default connect(mapStateToProps)(Connection);