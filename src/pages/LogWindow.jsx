import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/Inbox';

import { userService } from '_services';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function LogWindow(props) {
  const classes = useStyles();

  const [logsNetwork, setLogsNetwork] = React.useState( [] );

  useEffect(() => {
    userService.sendGETRequest("/network/logs", {network: props.network_id}, function(result){
        setLogsNetwork( result['json_list']);
    });
  },[]);

  return (
    <div className={classes.root}>
      <List component="nav" aria-label="main mailbox folders">
          {logsNetwork.map(function(item){
              return <ListItem button>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary={item.user_id} secondary={item.description} />
            </ListItem>
          })}
        
      </List>
    </div>
  );
}

