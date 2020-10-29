import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import { makeStyles } from '@material-ui/core/styles';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';

import { history } from '_helpers';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

library.add(fab, fas, far);

const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
    },
    iconStyle:{
        marginRight: 5,
    }
  }));

function NewQuestion(props) {
  const [values, setValues] = React.useState({
      open: false,
      tipo_activity: "",
  });
  
  const theme = useTheme();
  const classes = useStyles();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  function createActivity() {
    history.push(`/painel/cursos/${props.id_network}/atividade/cadastro/`+values.tipo_activity);
  }

  function handleClickOpen() {
    setValues({ ...values, open: true });
  }

  function handleClose() {
    setValues({ ...values, open: false });
  }

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Cadastrar atividade
      </Button>
      <Dialog
        fullScreen={fullScreen}
        open={values.open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{"Selecione um tipo"}</DialogTitle>
        <DialogContent>
          <FormControl component="fieldset" className={classes.formControl}>
            <FormLabel component="legend">Tipos</FormLabel>
                <RadioGroup
                    aria-label="Tipos"
                    name="tipo_atividade"
                    className={classes.group}
                    value={values.tipo_activity}
                    onChange={(event) => setValues({ ...values, tipo_activity: event.target.value })}
                >
                    <FormControlLabel value="database" control={<Radio />} label={<div>
                        <FontAwesomeIcon className={classes.iconStyle} color="#000" size="lg" icon={['fas', 'database']} />
                        Base de dados
                    </div>} />
                    <FormControlLabel value="chat" control={<Radio />} label={<div>
                        <FontAwesomeIcon className={classes.iconStyle} color="#000" size="lg" icon={['fab', 'rocketchat']} />
                        Chat
                    </div>} />

                    <FormControlLabel value="choice" control={<Radio />} label={<div>
                        <FontAwesomeIcon className={classes.iconStyle} color="#000" size="lg" icon={['fas', 'question-circle']} />
                        Escolha
                    </div>} />

                    <FormControlLabel value="externtool" control={<Radio />} label={<div>
                        <FontAwesomeIcon className={classes.iconStyle} color="#000" size="lg" icon={['fas', 'puzzle-piece']} />
                        Ferramenta externa
                    </div>} />

                    <FormControlLabel value="forum" control={<Radio />} label={<div>
                        <FontAwesomeIcon className={classes.iconStyle} color="#000" size="lg" icon={['far', 'comments']} />
                        Fórum
                    </div>} />

                    <FormControlLabel value="glossario" control={<Radio />} label={<div>
                        <FontAwesomeIcon className={classes.iconStyle} color="#000" size="lg" icon={['fas', 'search-plus']} />
                        Glossário
                    </div>} />

                    <FormControlLabel value="quiz" control={<Radio />} label={<div>
                        <FontAwesomeIcon className={classes.iconStyle} color="#000" size="lg" icon={['fas', 'file-signature']} />
                        Questionário
                    </div>} />

                    <FormControlLabel value="wiki" control={<Radio />} label={<div>
                        <FontAwesomeIcon className={classes.iconStyle} color="#000" size="lg" icon={['fab', 'wikipedia-w']} />
                        Wiki
                    </div>} />

                </RadioGroup>
            </FormControl>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={createActivity} color="primary" autoFocus>
            Criar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

NewQuestion.propTypes = {
    id_network: PropTypes.string,
};

export default NewQuestion;