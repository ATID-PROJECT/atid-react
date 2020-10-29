import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import FormControl from '@material-ui/core/FormControl';
import { Grid } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    root: {
      width: "100%"
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular
    }
}));

function ConditionalBlock(props) {
    const classes = useStyles();

    if (props.type === "min_msgs")
    {
        return(
            <div>
            <Grid container>
                <Grid item xs={12} >
                    <div>
                    <span style={{display: "inline-block", marginTop: "39px", "marginRight": "0 12px"}}>Deve enviar 
                    no mínimo </span>
                    <TextField
                            id="standard-msgs"
                            label="Quantidade"
                            className={classes.textField}
                            value={props.item.min_msgs}
                            onChange={props.handleChange('min_msgs')}
                            style={{marginRight: 8, marginLeft: 8}}
                            margin="normal"
                        />
                    <span style={{display: "inline-block", marginTop: "39px", "marginRight": "0 12px"}}>mensagens </span>
                    </div>
                </Grid>
            </Grid>
            </div>
        );
    }
    else if( props.type === "check_attemp")
    {
        return(
            <>
                <Grid container>
                    <Grid item xs={12} >
                        <div>
                        <span style={{display: "inline-block", marginTop: "39px", "marginRight": "0 12px"}}>Tentativas </span>
                        <span style={{display: "inline-block", marginTop: "39px", "margin": "0 6px"}}> corresponder a:</span>
                        <TextField
                            id="standard-name"
                            label="Quantidade"
                            className={classes.textField}
                            value={props.item.attemps_target}
                            onChange={props.handleChange('attemps_target')}
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                              }}
                        />
                        </div>
                    </Grid>
                </Grid>
            </>
        );
    }
    else if( props.type === "compare_note")
    {
        return(
            <>
                <Grid container>
                    <Grid item xs={12} >
                        <div>
                        <span style={{display: "inline-block", marginTop: "39px", "marginRight": "0 12px"}}>Nota </span>
                        <FormControl 
                        margin="normal"
                        style={{marginRight: 8, marginLeft: 8}}
                        className={classes.textField}>
                            <InputLabel htmlFor="type_grade">Tipo</InputLabel>
                            <Select
                            value={props.item.type_grade}
                            onChange={props.handleChange("type_grade")}
                            inputProps={{
                                name: 'type_grade',
                                id: 'type_grade',
                            }}
                            >
                            <MenuItem value={'min'}>mínima</MenuItem>
                            <MenuItem value={'max'}>máxima</MenuItem>
                            <MenuItem value={'equal'}>exata</MenuItem>
                            </Select>
                        </FormControl>
                        <span style={{display: "inline-block", marginTop: "39px", "margin": "0 6px"}}> corresponder a :</span>
                        <TextField
                            id="standard-name"
                            label="ponto(s)"
                            className={classes.textField}
                            value={props.item.grade_percentage}
                            onChange={props.handleChange('grade_percentage')}
                            margin="normal"
                        />
                        </div>
                    </Grid>
                </Grid>
            </>
        );
    }

    return( <></> );
}

export default ConditionalBlock;