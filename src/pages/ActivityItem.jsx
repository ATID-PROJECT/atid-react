import React, { Fragment } from "react";
import { Grid } from '@material-ui/core';

import Chat from "components/forms/Chat";
import Database from "components/forms/Database";
import Choice from "components/forms/Choice";
import ExternTool from "components/forms/ExternTool";
import Forum from "components/forms/Forum";
import Glossario from "components/forms/Glossario";
import Wiki from "components/forms/Wiki";
import Quiz from "components/forms/Quiz";

function ActivityItem(props) {

    const [values, setValues] = React.useState({
        network_id: props.match.params.id,
        uuid: props.match.params.uuid,
        tipo: props.match.params.tipo,
    });

    const getActivity = ( tipo ) => {
        if( !tipo ) return (<div></div>);
        else if(tipo.toLowerCase() === "chat")
        {
            return( <Chat network_id={values.network_id} uuid={values.uuid} /> );
        }
        else if(tipo.toLowerCase() === "quiz")
        {
            return( <Quiz network_id={values.network_id} uuid={values.uuid} /> );
        }
        else if(tipo.toLowerCase() === "database")
        {
            return( <Database network_id={values.network_id} uuid={values.uuid} /> );
        }
        else if(tipo.toLowerCase() === "choice")
        {
            return( <Choice network_id={values.network_id} uuid={values.uuid} /> );
        }
        else if(tipo.toLowerCase() === "externtool")
        {
            return( <ExternTool network_id={values.network_id} uuid={values.uuid} /> );
        }
        else if(tipo.toLowerCase() === "forum")
        {
            return( <Forum network_id={values.network_id} uuid={values.uuid} /> );
        }
        else if(tipo.toLowerCase() === "glossario")
        {
            return( <Glossario network_id={values.network_id} uuid={values.uuid} /> );
        }
        else if(tipo.toLowerCase() === "wiki")
        {
            return( <Wiki network_id={values.network_id} uuid={values.uuid} /> );
        }
    }
   
    const activity = getActivity( values.tipo );

    return (
        <Fragment>
            <Grid container style={{padding: "0 25px"}}>
                <Grid item xs={12}>
                    
                    #{values.network_id}
                    
                </Grid>
            </Grid>
        {activity}
        </Fragment>
    );
    
}

export default ActivityItem;