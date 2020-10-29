import React from "react";
import { dialogActions } from "_actions";
import deburr from "lodash/deburr";

import Downshift from "downshift";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Button from "@material-ui/core/Button";
import { useTheme } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";

import { userService } from "_services";
import { useSelector, useDispatch } from "react-redux";

function renderInput(inputProps) {
  const { InputProps, classes, ref, ...other } = inputProps;

  return (
    <TextField
      InputProps={{
        required: true,
        inputRef: ref,
        classes: {
          root: classes.inputRoot,
          input: classes.inputInput
        },
        ...InputProps
      }}
      {...other}
    />
  );
}

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

function removerAcentos(newStringComAcento) {
  var string = newStringComAcento;
  var mapaAcentosHex = {
    a: /[\xE0-\xE6]/g,
    e: /[\xE8-\xEB]/g,
    i: /[\xEC-\xEF]/g,
    o: /[\xF2-\xF6]/g,
    u: /[\xF9-\xFC]/g,
    c: /\xE7/g,
    n: /\xF1/g
  };

  for (var letra in mapaAcentosHex) {
    var expressaoRegular = mapaAcentosHex[letra];
    string = string.replace(expressaoRegular, letra);
  }

  return string;
}

function ConfigNode(props) {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const dialog = useSelector(state => state.dialog);
  const dispatch = useDispatch();

  const [values, setValues] = React.useState({
    open: true,
    suggestions: [],
    inputValue: "",
    load: false,
  });

  function handleClose() {
    setValues({ ...values, inputValue: "", load: false });
    dispatch(dialogActions.closeDialog("activity_config"));
  }

  const isOpenDialog = function() {
    const result =
      dialog.type === "opened" && dialog.name === "activity_config";

    return result;
  };

  function changeSuggeston(value, type) {
    props.setProperties("suggestion_uuid", value);
    props.setProperties("suggestion_type", type);
  }

  function loadCurrentSugestion() {
    userService.sendGETRequest(
      "/questions/get",
      {
        network_id: dialog.id_network,
        uuid: dialog.uuid
      },
      function(result) {
        if (result.length > 0) {
          setValues({ ...values, inputValue: result[0].question.name, load: true });
        } else {
          setValues({ ...values, inputValue: " ", load: true });
        }
      }
    );
  }

  if( !values.load && dialog.type === "opened" && dialog.name === "activity_config")
  {
    loadCurrentSugestion();
  }

  function loadSugestions() {
    userService.sendGETRequest(
      "/questions/getAll",
      {
        page: 1,
        page_size: 5,
        network_id: dialog.id_network
      },
      function(response) {
        var suggestions = [];

        var array = Array.from(
          Object.keys(response),
          k => response[k]["question"]
        );
        array.forEach(function name(params) {
          suggestions.push({
            label: params.name,
            type: params.label,
            uuid: params.uuid
          });
        });

        setValues({ ...values, suggestions: suggestions });
      }
    );
  }

  function getSuggestions(value) {
    const inputValue = deburr(value.trim()).toLowerCase();
    const inputLength = inputValue.length;
    let count = 0;

    return inputLength === 0
      ? []
      : values.suggestions.filter(suggestion => {
          const keep =
            count < 5 &&
            removerAcentos(
              suggestion.label.slice(0, inputLength).toLowerCase()
            ) === removerAcentos(inputValue);

          if (keep) {
            count += 1;
          }

          return keep;
        });
  }

  function renderSuggestion({
    suggestion,
    index,
    itemProps,
    highlightedIndex,
    selectedItem
  }) {
    const isHighlighted = highlightedIndex === index;
    const isSelected = (selectedItem || "").indexOf(suggestion.label) > -1;

    return (
      <MenuItem
        {...itemProps}
        key={suggestion.uuid}
        selected={isHighlighted}
        onClick={e => {
          itemProps.onClick(e);
          changeSuggeston(suggestion.uuid, suggestion.type);
        }}
        component="div"
        style={{
          fontWeight: isSelected ? 500 : 400
        }}
      >
        {suggestion.label + " - " + suggestion.type}
      </MenuItem>
    );
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
          {"Configurar atividade"}
        </DialogTitle>
        <DialogContent>
          <div style={{ marginBottom: 10 }}>
            <Downshift
              id="downshift-options"
              selectedItem={values.inputValue}
              onStateChange={state => {
                loadSugestions();
              }}
            >
              {({
                clearSelection,
                getInputProps,
                getItemProps,
                getLabelProps,
                getMenuProps,
                highlightedIndex,
                inputValue,
                isOpen,
                openMenu,
                selectedItem
              }) => {
                const {
                  onBlur,
                  onChange,
                  onFocus,
                  ...inputProps
                } = getInputProps({
                  onChange: event => {
                    if (event.target.value === "") {
                      clearSelection();
                    }
                  },
                  onFocus: openMenu,
                  placeholder: "Digite o nome da atividade que deseja associar"
                });

                return (
                  <div className={classes.container}>
                    {renderInput({
                      fullWidth: true,
                      classes,
                      label: "Associado com",
                      InputLabelProps: getLabelProps({ shrink: true }),
                      InputProps: { onBlur, onChange, onFocus },
                      inputProps
                    })}

                    <div {...getMenuProps()}>
                      {isOpen ? (
                        <Paper className={classes.paper} square>
                          {getSuggestions(inputValue).map((suggestion, index) =>
                            renderSuggestion({
                              suggestion,
                              index,
                              itemProps: getItemProps({
                                item: suggestion.label
                              }),
                              highlightedIndex,
                              selectedItem
                            })
                          )}
                        </Paper>
                      ) : null}
                    </div>
                  </div>
                );
              }}
            </Downshift>
          </div>

          <DialogContentText>
            Digite o nome de uma atividade existente, ou crie uma nova{" "}
            <a target="_blank" rel="noopener noreferrer" href={`/painel/cursos/editar/${dialog.id_network}?tab=activity`}>
              clicando aqui.
            </a>
          </DialogContentText>

          <Grid container>
            <Grid item xs={12}>
              <TextField
                id="standard-name"
                label="Nome"
                className={classes.textField}
                value={props.getProperties("name")}
                onChange={e => props.setProperties("name", e.target.value)}
                margin="normal"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="standard-name"
                label="Descrição"
                className={classes.textField}
                value={props.getProperties("description")}
                onChange={e =>
                  props.setProperties("description", e.target.value)
                }
                margin="normal"
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ConfigNode;