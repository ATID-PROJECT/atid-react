import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Tooltip } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import InputLabel from "@material-ui/core/InputLabel";
import { Grid } from "@material-ui/core";

import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import PropTypes from "prop-types";
import ConditionalBlock from "./ConditionalBlock";

import { fixValues, 
  delete_item,
  update_item } from "components/condition/util";

library.add(fas, fab);

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%"
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  }
}));

function ConditionItem(props) {
  const classes = useStyles();
  const [values, setValues] = React.useState({
    open: false,
    grade_percentage: 0,
  });

  

  const deleteItem = function(id) {
    var items = props.parentValues.items;
    delete_item(items, "id", id);
    fixValues(items);
    props.parentSetValues({ ...props.parentValues, items: items });
  };

  const openConfig = function() {
    setValues({ ...values, open: !values.open });
  };

  const handleChange = name => event => {

    var items = props.parentValues.items;
    update_item(items, props.item.id, name, event.target.value);

    if( name === "condition_type")
    {
      update_item(items, props.item.id, "text", "Configurando");
    }
    else if( name === "min_msgs")
    {
      update_item(items, props.item.id, "text", `Número mínimo de ${event.target.value} mensagens`);
    }
    else if(name === "attemps_target")
    {
      update_item(items, props.item.id, "text", `Tentativas corresponde a ${event.target.value}`);
    }
    else if( name === "grade_percentage" || name === "type_grade")
    {
      var type_grade = "min";
      var grade_percentage = 0;
      if(name === "grade_percentage")
      {
        type_grade = props.item.type_grade;
        grade_percentage = event.target.value;
        setValues({...values, grade_percentage: grade_percentage});
      }else{
        type_grade = event.target.value;
        grade_percentage = values.grade_percentage;
      }
      update_item(items, props.item.id, "text", `Nota ${type_grade} de ${grade_percentage} ponto(s)`);
    }

    fixValues(items);
    props.parentSetValues({ ...props.parentValues, items: items });

  };

  const getValueItem =  function( name ) {
    if( props.item[name] === undefined )
    {
      return "";
    }
    return props.item[name];
   
  }

  const arrow_button = values.open ? "arrow-up" : "arrow-down";

  const activity_option = props.associated_activities.map(function(item, index){
    return(
        <option key={index} value={item.id}>{item.name}</option>
    );
  });

  function getActivityById( id_activity ){
    for( var i = 0; i < props.associated_activities.length; i++  )
    {
      if( props.associated_activities[i].id === id_activity)
      {
        return props.associated_activities[i];
      }
    }
  }

  function getConditions(){
    const condition_options = [];

    if( getValueItem("activity").length === 0 )
    {
      return condition_options;
    }

    const current_item = getActivityById( props.item.activity );
    const suggestion_type = current_item.suggestion_type.toLowerCase();

    if( suggestion_type === "chat")
    {
      return(
        <option value={"min_msgs"}>{"Número de mensagens"}</option>
      );
    }
    else if( suggestion_type === "quiz")
    {
      return (
        <>
        <option value={"compare_note"}>{"Comparar nota"}</option>
        <option value={"check_attemp"}>{"Verificar tentativas"}</option>
        </>
      )
    }
    return condition_options;
  }

  return (
    <div
      style={{
        cursor: "pointer",
        border: "1px solid #ccc",
        padding: "10px 15px",
        background: props.collapseIcon ? "#d2cccc none repeat scroll 0% 0%" : ""
      }}
    >
      {props.handler}
      {props.collapseIcon}
      {props.item.text}
      <div style={{ float: "right", marginTop: "-8px" }}>
        {props.item.type !== "and" && props.item.type !== "or" && (
          <Tooltip onClick={openConfig} title="Configurar atividades">
            <IconButton aria-label="Share">
              <FontAwesomeIcon
                color="#0B849A"
                size="xs"
                icon={["fas", arrow_button]}
              />
            </IconButton>
          </Tooltip>
        )}

        <Tooltip title="Remover" onClick={() => deleteItem(props.item.id)}>
          <IconButton aria-label="Share">
            <FontAwesomeIcon
              color="#0B849A"
              size="xs"
              icon={["fas", "trash"]}
            />
          </IconButton>
        </Tooltip>
      </div>

      {values.open && (
        <div>
          <Grid container>
            <Grid item md={2}>
              <FormControl fullWidth className={classes.formControl}>
                <InputLabel htmlFor="activity-native-simple">Nome da Atividade</InputLabel>
                <Select
                  native
                  
                  value={getValueItem("activity")}
                  onChange={handleChange("activity")}
                  inputProps={{
                    name: "activity",
                    id: "activity-native-simple"
                  }}
                >
                    <option value=""></option>
                  { activity_option }
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={1} style={{textAlign: 'center',}}>
                <IconButton aria-label="Share" style={{marginTop: "10px"}}>
                    <FontAwesomeIcon
                    color="#0B849A"
                    size="xs"
                    icon={["fas", "long-arrow-alt-right"]}
                    />
                </IconButton>
            </Grid>
            <Grid item md={2}>
              <FormControl fullWidth className={classes.formControl}>
                <InputLabel htmlFor="age-native-simple">Tipo de Condição</InputLabel>
                <Select
                  native
                  value={getValueItem("condition_type")}
                  onChange={handleChange("condition_type")}
                  inputProps={{
                    name: "condition_type",
                    id: "condition_type-native-simple"
                  }}
                >
                  <option value=""></option>
                  { getConditions() }
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          {getValueItem("condition_type").length > 0 &&
            <ConditionalBlock 
            handleChange={handleChange}
            type={props.item.condition_type}
            item={props.item} />
          }
        </div>
      )}
    </div>
  );
}

ConditionItem.propTypes = {
  classes: PropTypes.object,
  parentSetValues: PropTypes.func.isRequired,
  parentValues: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
  collapseIcon: PropTypes.object,
  handler: PropTypes.object
};

export default ConditionItem;
