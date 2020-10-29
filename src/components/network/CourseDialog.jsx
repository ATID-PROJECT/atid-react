import React from "react";
import { dialogActions } from "_actions";

import { makeStyles } from "@material-ui/core/styles";

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

function CourseDialog(props) {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const dialog = useSelector(state => state.dialog);
  const dispatch = useDispatch();

  const [values, setValues] = React.useState({
    name: "",
    initials: "",
  });

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const createCourse = function() {
    if(values.name.length === 0 || values.initials.length === 0)
    {
        toast(`Todos os campos são obrigatórios.`, {
            transition: Bounce,
            closeButton: true,
            autoClose: 4000,
            position: 'bottom-right',
            type: 'error'
        });
    }

    userService.sendPOSTRequest('/moodle/new_course', {
        network_id: dialog.id_network,
        fullname: values.name,
        shortname: values.initials,
    },
    function (response) {
         handleClose();
         toast(`O curso ${values.name} foi criado no ambiente virtual.`, {
            transition: Bounce,
            closeButton: true,
            autoClose: 4000,
            position: 'bottom-right',
            type: 'success'
        });
    },
    function( error ){
        toast(`A conecção não pode ser realizada.`, {
            transition: Bounce,
            closeButton: true,
            autoClose: 4000,
            position: 'bottom-right',
            type: 'error'
        });
    });
  }

  function handleClose() {
    setValues({ ...values, inputValue: "", load: false, name: "", initials: "" });
    dispatch(dialogActions.closeDialog("create_course"));
  }

  const isOpenDialog = function() {
    const result =
      dialog.type === "opened" && dialog.name === "create_course";

    return result;
  };

  return (
    <div className={classes.root}>
      <Dialog
        fullScreen={fullScreen}
        open={isOpenDialog()}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Criar uma imagem da rede no ambiente virtual"}
        </DialogTitle>
        <DialogContent>
          <Grid container>
            <Grid item xs={12}>
                <TextField
                    id="standard-name"
                    fullWidth
                    label="Nome do curso"
                    className={classes.textField}
                    value={values.name}
                    onChange={handleChange('name')}
                    margin="normal"
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    id="standard-initials"
                    fullWidth
                    label="Sigla"
                    className={classes.textField}
                    value={values.initials}
                    onChange={handleChange('initials')}
                    margin="normal"
                />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Fechar
          </Button>
          <Button onClick={createCourse} color="primary" variant="contained" autoFocus>
              Criar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default CourseDialog;