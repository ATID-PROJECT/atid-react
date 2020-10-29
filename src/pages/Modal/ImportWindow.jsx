import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from "@material-ui/core/Button";
import TextField from '@material-ui/core/TextField';
import { Link } from "react-router-dom";

import {
    Typography,
  } from "@material-ui/core";

import Grid from '@material-ui/core/Grid';
import { userService } from "_services";
import {
  toast,
  Bounce
} from 'react-toastify';

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles(theme => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #e0e0e0',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function ImportWindow() {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  const [avaUrl, setAvaUrl] = React.useState("");
  const [avaToken, setAvaToken] = React.useState("");
  const [avaCourseName, setAvaCourseName] = React.useState("");

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    userService.sendPOSTRequest("/network/import", 
      {   
        url_base: avaUrl,
        token: avaToken,
        course_name: avaCourseName
      },
      function(response)
      {
        toast("Curso importado.", {
          transition: Bounce,
          closeButton: true,
          autoClose: 5000,
          position: 'bottom-right',
          type: 'success'
        });
        handleClose();
        setTimeout(() => {
          window.location.reload(true);
        }, 2000);
      },
      function(response){
        toast("Nenhum curso encontrado.", {
          transition: Bounce,
          closeButton: true,
          autoClose: 5000,
          position: 'bottom-right',
          type: 'error'
        });
      });
  };

  return (
    <div>
      <Button onClick={handleOpen} variant="contained" color="primary">Importar rede</Button>
      <Link to="/painel/cursos/cadastro">
        <Button variant="contained" color="primary">Novo curso</Button>
      </Link>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={handleClose}
      >
        <form onSubmit={handleSubmit}  style={modalStyle} className={classes.paper}>
        <Grid container>
            <Grid item xs={12}>
                <Typography style={{width: '100%', textAlign: 'center'}}>Importar curso do MOODLE</Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
              fullWidth
              id="standard-address"
              label="Endereço do sistema"
              className={classes.textField}
              margin="normal"
              value={avaUrl}
              onChange={(e) => setAvaUrl(e.target.value)}
            />
            </Grid>
            <Grid item xs={12}>
              <TextField
              fullWidth
              id="standard-address"
              label="Token de acesso"
              className={classes.textField}
              value={avaToken}
              onChange={(e) => setAvaToken(e.target.value)}
              margin="normal"
            />
            </Grid>
            <Grid item xs={12}>
              <TextField
              fullWidth
              id="standard-address"
              label="Nome do curso"
              className={classes.textField}
              margin="normal"
              value={avaCourseName}
              onChange={(e) => setAvaCourseName(e.target.value)}
            />
            </Grid>
            <Grid item xs={12} style={{margin: 10, textAlign: 'center'}}>
                <Button type="submit" variant="contained" color="secondary">Importar</Button>
            </Grid>
          </Grid>
          </form>
      </Modal>
    </div>
  );
}