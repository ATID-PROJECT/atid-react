import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { userService } from "_services";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  toast,
  Bounce
} from 'react-toastify';

import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";

import { history } from '../../_helpers';
library.add(fab, fas, far);

export default function DeleteDialog(props) {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseAndDelete = () => {
    userService.sendPOSTRequest('/course/delete', {
      id: props.id_course,
    }, 
    function(response){
      setOpen(false);
      history.push('/painel/turmas/');
      toast("Curso removido.", {
        transition: Bounce,
        closeButton: true,
        autoClose: 3000,
        position: 'bottom-right',
        type: 'success'
      });
    });
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        <FontAwesomeIcon
            color="#0B849A"
            size="md"
            icon={["fas", "trash"]}
          />
      </Button>

      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{"Deletar Curso"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            O curso pode ser deletado apenas no sistema ATID ou optar por também apagar o curso no ambiente virtual.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleCloseAndDelete} color="primary" autoFocus>
            Apagar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}