import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

import { userService } from '_services';
import PropTypes from 'prop-types';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
    },
  }));

function DeleteActivity( props ) {
  const [values, setValues] = React.useState({
      open: false,
      network_id: props.network_id,
      uuid: props.uuid_activity,
      name: props.name_activity,
      label: props.label_activity.toLowerCase(),
  });
  const theme = useTheme();
  const classes = useStyles();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  function handleClickOpen() {
    setValues({ ...values, open: true });
  }

  function handleClose() {
    setValues({ ...values, open: false });
  }

  const submit = function(){
    handleClose();

    props.submit(values.label, values.uuid, props.position);
    
  }

  return (
    <div>
        <IconButton onClick={handleClickOpen} aria-label="delete" className={classes.margin}>
            <DeleteIcon fontSize="large" />
        </IconButton>
      <Dialog
        fullScreen={fullScreen}
        open={values.open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{"Você deseja remover a atividade?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Esta ação não é reversível. Confirme se você deseja deletar a atividade: "{values.name}".
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={submit} color="primary" autoFocus>
            Deletar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

DeleteActivity.propTypes = {
    uuid_activity: PropTypes.string.isRequired,
    name_activity: PropTypes.string.isRequired,
    label_activity: PropTypes.string.isRequired,
    position: PropTypes.any.isRequired,
    submit: PropTypes.func.isRequired,
};

export default DeleteActivity;