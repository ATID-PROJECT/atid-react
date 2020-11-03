import React from "react";
import { dialogActions } from "_actions";

import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";

import { Grid } from "@material-ui/core";

import Slide from "@material-ui/core/Slide";
import Nestable from "react-nestable";
import uuid from "uuid";

import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";

import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";

import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";

import { useSelector, useDispatch } from "react-redux";
import ConditionItem from "./condition/ConditionItem";

library.add(fas, fab);

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    position: "relative",
    background: "#04709E !important"
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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function ConfigTransiction(props) {
  const classes = useStyles();

  const dialog = useSelector(state => state.dialog);
  const dispatch = useDispatch();

  const [values, setValues] = React.useState({
    open: true,
    suggestions: [],
    inputValue: "",
    items: [],
    load: false,
  });

  if (!values.load && dialog.type === "opened" && dialog.name === "transction_config") {
    loadConditions();
  }

  function loadConditions() {
    var item_temp = props.getProperties("conditions");
    item_temp = item_temp ? item_temp : [];
    fixValues(item_temp);

    setValues({ ...values, items: item_temp, load: true });
  }

  const ADD_QUESTION = function () {
    var items = values.items;
    items.unshift({
      id: uuid.v4(),
      type: "question",
      question: "",
      text: "Condição não configurada."
    });
    setValues({ ...values, items: items });
  };

  function fixValues(obj) {
    for (var property in obj) {
      if (obj[property] == null) {
        delete obj[property];
      }

      if (obj.hasOwnProperty(property)) {
        if (typeof obj[property] == "object") {

          fixValues(obj[property]);
        }

      }
    }
  }

  const renderItem = ({ item, collapseIcon, handler }) => {
    return (
      <ConditionItem
        parentSetValues={setValues}
        parentValues={values}
        item={item}
        collapseIcon={collapseIcon}
        associated_activities={props.associated_activities}
        handler={handler} />
    );
  };

  function handleClose() {
    props.setProperties("conditions", values.items);
    setValues({ ...values, inputValue: "", load: false });
    dispatch(dialogActions.closeDialog("transction_config"));
  }

  const isOpenDialog = function () {
    const result =
      dialog.type === "opened" && dialog.name === "transction_config";
    return result;
  };

  return (
    <div>
      <Dialog
        fullScreen
        open={isOpenDialog()}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Transição
            </Typography>
          </Toolbar>
        </AppBar>

        <Grid container style={{ padding: 10 }}>
          <div
            style={{
              width: "100%",
              border: "1px solid rgb(204, 204, 204)",
              padding: "10px 15px",
              textAlign: "center",
              background: "#eee3e39e",
              color: "#000",
              fontWeight: "bold",

              userSelect: "none"
            }}
          >
            As configurações feitas aqui irão impactar na liberação, ou
            bloqueio, das atividades associadas a esta transição.
          </div>
          <Grid item md={12} xs={12}>
            <div style={{ padding: "10px 0", textAlign: "right" }}>

              <Fab
                variant="extended"
                size="small"
                color="primary"
                aria-label="add"
                className={classes.margin}
                onClick={ADD_QUESTION}
              >
                <AddIcon className={classes.extendedIcon} />
                NOVA CONDIÇÃO
              </Fab>
            </div>
          </Grid>
          <Grid item md={12} xs={12}>
            <div className="card p-3">
              <h2 className="mb-4">Configurar transições</h2>
              {props.associated_activities.length > 0 ?
                <Nestable
                  onChange={items => setValues({ ...values, items: items })}
                  items={values.items}
                  renderItem={renderItem}
                />
                :
                <p>Conecta esta transição com um nó <b>associado</b> a uma atividade.</p>
              }
              {values.items.length === 0 &&
                <div class="alert alert-info" role="alert">
                  Nenhuma condição existente para esta transição.
              </div>
              }
            </div>
          </Grid>
        </Grid>
      </Dialog>
    </div>
  );
}

export default ConfigTransiction;
