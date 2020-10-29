import React from "react";
import { dialogActions } from "_actions";

import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

import { userService } from "_services";
import { useSelector, useDispatch } from "react-redux";

import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';

import {
  useParams
} from "react-router-dom";

import loading from "assets/img/loading.gif";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  container: {
    flexGrow: 1,
    position: "relative"
  },
  horizontalList: {
    display: 'flex',
    flexDirection: 'row',
    padding: 0,
  },
  horizontalItem: {
      display: 'inline-block',
      overflow: 'break'
  }
}));

function InfoActivity(props) {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const dialog = useSelector(state => state.dialog);
  const dispatch = useDispatch();

  const [isLoad, setLoad] = React.useState(false);
  const [isError, setError] = React.useState(false);
  const [isFullyCharged, setCharged] = React.useState(false);

  const [users, setUsers] = React.useState([]);

  function handleClose() {
    dispatch(dialogActions.closeDialog("activity_info"));
    setTimeout(() => {
      setUsers( [] );
      setLoad( false  );
      setCharged( false  );
      setError( false );
    }, 1000);
  }

  const isOpenDialog = function() {
    const result =
      dialog.type === "opened" && dialog.name === "activity_info";

    return result;
  };

  function loadCurrentSugestion() {
    setLoad( true );
     
    userService.sendGETRequest(
      "/moodle/students/",
      {
        network_id: dialog.id_network,
        course_id: props.id_course,
        activity_id: props.getProperties("suggestion_uuid"),
        activity_type: props.getProperties("suggestion_type")
      },
      function(result) {
        setCharged( true  );
        setUsers( result );
      },
      function(error)
      {
        setError( true );
        setCharged( true  );
      }
    );
  }

  if( !isLoad && dialog.type === "opened" && dialog.name === "activity_info")
  {

    loadCurrentSugestion();
  }

  let { id, network } = useParams();

  return (
    <div className={classes.root}>
      <Dialog
        fullScreen={fullScreen}
        open={isOpenDialog()}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Status dos alunos na atividade"}
          <Button 
          href={`/painel/turma/${id}/rede/${network}/activity/${props.curretSelectedElement.suggestion_uuid}/`}
          target="_blank"
          variant="contained" 
          color="secondary" 
          style={{marginLeft: 20}}>
            Mais detalhes
          </Button>
        </DialogTitle>
        <DialogContent>

          <DialogContentText>
            Alunos que estão realizando esta atividade
          </DialogContentText>

          {(!isLoad || !isFullyCharged) &&
           <div className="loader">
            <img src={loading} alt="loading" />
          </div>
          }

          <Grid container spacing={2}>
          {users.map((user, index) => {
            const labelId = `checkbox-list-secondary-label-${index}`;
            return (
              <Grid md={3} key={index} button>
                <ListItemAvatar>
                  <Avatar
                    alt={`Avatar n°${index + 1}`}
                    src={user.profileimageurl}
                  />
                </ListItemAvatar>
                <ListItemText id={labelId} primary={user.firstname} />
  
              </Grid>
            );
          })}

          {isError &&
            <Grid className={classes.horizontalItem} button>
                <ListItemText id={"notFound"} primary={"Nenhum usuário encontrado."} />
              </Grid>
          }
        </Grid>
        </DialogContent>
        
      </Dialog>
    </div>
  );
}

export default InfoActivity;