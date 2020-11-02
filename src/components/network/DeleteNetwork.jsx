import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { userService } from '_services';
import PropTypes from "prop-types";

import {
  toast,
  Bounce
} from 'react-toastify';


function DeleteActivity(props) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  function deleteNetwork() {

    userService.sendPOSTRequest('/network/delete', {
      id: props.id_network
    },
      function (response) {

        document.getElementById(props.id_network).remove();

        toast(`Rede '${props.name_network}' removida.`, {
          transition: Bounce,
          closeButton: true,
          autoClose: 5000,
          position: 'bottom-right',
          type: 'success'
        });


      });
    props.handleClose();
  }

  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Você deseja remover a rede?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Esta ação não é reversível. Confirme se você deseja deletar a
            rede: "{props.name_network}".
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={deleteNetwork} color="primary" autoFocus>
            Deletar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

DeleteActivity.propTypes = {
  id_network: PropTypes.string.isRequired,
  name_network: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default DeleteActivity;
