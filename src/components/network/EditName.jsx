import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { userService } from '_services';
import {
    toast,
    Bounce
} from 'react-toastify';

import { Tooltip } from "@material-ui/core";
import PropTypes from 'prop-types';

function EditName(props) {

    const [values, setValues] = React.useState({
        name: "",
        open: false,
    });

    const handleClickOpen = () => {
        setValues({ ...values, open: true });
    }

    const handleClose = () => {
        setValues({ ...values, open: false });
    }

    const handleChange = name => event => {
        setValues({ ...values, [name]: event.target.value });
    };

    const existErros = () => {
        if (values.name.length < 2) {
            toast("Mínimo 2 caracteres.", {
                transition: Bounce,
                closeButton: true,
                autoClose: 5000,
                position: 'bottom-right',
                type: 'error'
            });

            return true;
        }
        return false;
    }

    const handleSave = () => {
        if (existErros()) return;

        handleClose();

        userService.sendPOSTRequest("/users/activity/save",
            {
                id: props.id_network,
                name: values.name,
            },
            function (response) {
                toast(response["message"], {
                    transition: Bounce,
                    closeButton: true,
                    autoClose: 5000,
                    position: 'bottom-right',
                    type: 'success'
                })
                props.setTitle(values.name);
            });
    }


    return (
        <div>
            <Tooltip onClick={handleClickOpen} disableFocusListener title="Alterar Nome">
                <Button>
                    {props.content}
                </Button>
            </Tooltip>

            <Dialog open={values.open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Alterar Nome</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Atribua um nome para facilitar localizar a rede na hora da busca.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Nome da rede"
                        type="email"
                        fullWidth
                        value={values.name}
                        onChange={handleChange('name')}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleSave} color="primary">
                        Salvar
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );

}

EditName.propTypes = {
    id_network: PropTypes.string,
    content: PropTypes.object,
};

export default EditName;