import React from 'react';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';

import PropTypes from 'prop-types';
import formStyle from "assets/jss/formStyle";

import { FormControl, InputLabel, InputBase, Grid } from '@material-ui/core';
import { userService } from '_services';
import { history } from '_helpers';

import {
  toast,
  Bounce
} from 'react-toastify';

function Chat(props) {
  const classes = formStyle();

  const [values, setValues] = React.useState({
    expanded: true,
    network_id: props.network_id,
    uuid: props.uuid ? props.uuid : "",
    name: "",
    description: "",
  });

  const carregarDados = function( uuid )
  {
    userService.sendGETRequest('/questions/chat', { 
      uuid: uuid,
      network_id: values.network_id
    },
    function(result){
      setValues({ ...values, 
        name: result[0]['chat']['name'],
        description: result[0]['chat']['description']
      });

    });
  }

  if( values.uuid && values.name.length === 0)
  {
    carregarDados( values.uuid );
  }

  function submit(){

    const option = values.uuid.length === 0 ? "post" : "put";

    if( values.name.length === 0)
    {
        toast("Campo obrigatório não preenchido.", {
            transition: Bounce,
            closeButton: true,
            autoClose: 5000,
            position: 'bottom-right',
            type: 'error'
          });
        return;
    }

    userService.sendRequest('/questions/chat/', option, {
        uuid: values.uuid,
        network_id: values.network_id,
        name: values.name,
        description: values.description,
    },
    function(result){
        backView();

        const msg = values.uuid.length === 0 ? "Chat cadastrado!" : "Chat atualizado!";

        toast(msg, {
          transition: Bounce,
          closeButton: true,
          autoClose: 5000,
          position: 'bottom-right',
          type: 'success'
      });
    });
  }

  function backView(){
    history.push(`/painel/cursos/${values.network_id}/recursos`);
  }

  function handleChangeEvent(e, prop_name) {
    setValues({ ...values, [prop_name]: e.target.value });
  }

  return (
    <div className={classes.root}>
      <ExpansionPanel expanded={values.expanded} onChange={() => setValues({ ...values, expanded: !values.expanded })}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>Geral</Typography>
        </ExpansionPanelSummary>

        <ExpansionPanelDetails>
          <Grid container>
            <Grid item xs={12}>
              <FormControl fullWidth className={classes.margin}>
                <InputLabel  shrink htmlFor="name" className={classes.bootstrapFormLabel}>
                  Nome do Chat *
                </InputLabel>
                <InputBase
                  id="name"
                  name="name"
                  required
                  value={values.name}
                  onChange={(e) => handleChangeEvent(e,"name")}
                  classes={{
                    root: classes.bootstrapRoot,
                    input: classes.bootstrapInput,
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth style={{padding: '20px 0'}} className={classes.margin}>
                <InputLabel  shrink htmlFor="description" className={classes.bootstrapFormLabel}>
                  Descrição
                </InputLabel>
                <InputBase
                  id="description"
                  name="description"
                  required
                  value={values.description}
                  rows="4"
                  multiline
                  onChange={(e) => handleChangeEvent(e,"description")}
                  classes={{
                    root: classes.bootstrapRoot,
                    input: classes.bootstrapInput,
                  }}
                />

              </FormControl>
            </Grid>
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    
      <Button onClick={backView} style={{marginRight: 10}} variant="contained" className={classes.button}>
        Cancelar
      </Button>

      <Button onClick={submit} variant="contained" color="secondary" className={classes.button}>
      {values.uuid.length === 0 ? "Cadastrar" : "Atualizar"}
      </Button>
    

    </div>
  );
}

Chat.propTypes = {
  id_network: PropTypes.string,
};

export default Chat;

