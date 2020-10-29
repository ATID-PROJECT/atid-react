import React, { useEffect } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import Grid from '@material-ui/core/Grid';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import InfiniteScroll from 'react-infinite-scroller';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { Link } from "react-router-dom";

import "assets/css/infiniteScroll.css";

import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import NewQuestion from "components/network/NewQuestion";
import DeleteActivity from "components/DeleteActivity";
import loading from 'assets/img/loading.gif';
import { history } from '_helpers';
import { userService } from '_services';

import SharedPannel from "pages/SharedPannel";
import LogWindow from "pages/LogWindow";
import SideDish from "pages/portal/network/sideDish";
import EditNetwork from 'pages/EditNetwork.jsx';
import GeneralNetwork from 'components/network/GeneralNetwork.jsx';

import {
  toast,
  Bounce
} from 'react-toastify';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { makeStyles } from '@material-ui/core/styles';

library.add(fab, fas, far)

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`wrapped-tabpanel-${index}`}
      aria-labelledby={`wrapped-tab-${index}`}
      {...other}
    >
      <Box p={3} style={{
        padding: '0',
        background: '#fff',
        marginTop: 15,
        boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 2px 1px -1px rgba(0,0,0,0.12)',
      }}>{children}</Box>
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  tabsPannel: {
    background: '#fff',
    boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 2px 1px -1px rgba(0,0,0,0.12)',
  },
}));

function ResourcesNetwork(props) {

  const classes = useStyles();
  const [shareArea, setSharedStatus] = React.useState(false);

  const [values, setValues] = React.useState({
    hasMoreItems: true,
    check1: false,
    isOwner: false,
    tab_id: "general",
    network_id: props.match.params.id,
    tracks: [],
  });

  useEffect(() => {

    var url = new URL(window.location.href);
    var tab = url.searchParams.get("tab") ? url.searchParams.get("tab") : "general";
    setValues({ ...values, tab_id: tab });

  }, []);


  if (!values.check1) {
    setValues({ ...values, check1: true });

    userService.sendGETRequest("/users/isowner", { network: values.network_id }, function (result) {
      setSharedStatus(true);
    }, function (error) {
    });
  }

  function handleChange(event, newValue) {
    setValues({ ...values, tab_id: newValue });
  }

  const getActivity = (page) => {

    userService.sendGETRequest('/questions/getAll', {
      'page': page, 'page_size': 1,
      'network_id': values.network_id,
    },

      function (response) {

        if (response.length === 0) {
          setValues({ ...values, hasMoreItems: false });
        }
        else if (values.hasMoreItems) {
          var tracks = values.tracks;

          var array = Array.from(Object.keys(response), k => response[k]["question"]);
          tracks.concat(array);
          array.forEach(function name(params) {
            tracks.push(params);
          })
          setValues({ ...values, tracks: tracks });

        }

        return response;
      }
    );
  }

  function loadItems(page) {

    if (values.hasMoreItems) {
      getActivity(page);
    }
  }

  const deleteActivity = function (label, uuid, position) {
    const url = `/questions/${label}`;
    userService.sendDELETERequest(url,
      {
        network_id: values.network_id,
        uuid: uuid,
      }, function (params) {

        if (!('name' in values.tracks[position])) return;

        const msg = `Atividade '${values.tracks[position].name}' removida! `;

        var tracks_temp = values.tracks;
        delete tracks_temp[position];

        setValues({ ...values, tracks: tracks_temp });


        toast(msg, {
          transition: Bounce,
          closeButton: true,
          autoClose: 5000,
          position: 'bottom-right',
          type: 'success'
        });

      })
  }

  const getIconQuestion = (tipo) => {
    tipo = tipo.toLowerCase();
    switch (tipo) {
      case "chat":
        return <FontAwesomeIcon color="#000" size="lg" icon={['fab', 'rocketchat']} />;
      case "choice":
        return <FontAwesomeIcon color="#000" size="lg" icon={['fas', 'question-circle']} />;
      case "database":
        return <FontAwesomeIcon color="#000" size="lg" icon={['fas', 'database']} />;
      case "externtool":
        return <FontAwesomeIcon color="#000" size="lg" icon={['fas', 'puzzle-piece']} />;
      case "forum":
        return <FontAwesomeIcon color="#000" size="lg" icon={['far', 'comments']} />;
      case "glossario":
        return <FontAwesomeIcon color="#000" size="lg" icon={['fas', 'search-plus']} />;
      case "wiki":
        return <FontAwesomeIcon color="#000" size="1x" icon={['fab', 'wikipedia-w']} />;
      default:
        return <FontAwesomeIcon color="#000" size="1x" icon={['fas', 'file-signature']} />;
    }
  }

  function getActivitysItem() {
    var items = [];
    values.tracks.map((track, i) => {
      const label = track['label'].toLowerCase();
      items.push(
        <ListItem key={i} button onClick={() => history.push(`/painel/cursos/${values.network_id}/atividade/editar/${label}/uuid/${track['uuid']}`)}>
          <ListItemIcon>
            {getIconQuestion(label)}
          </ListItemIcon>
          <ListItemText primary={track["name"]} />
          <ListItemSecondaryAction>
            <DeleteActivity submit={deleteActivity} position={i} label_activity={track['label']} name_activity={track["name"]} uuid_activity={track["uuid"]} />
          </ListItemSecondaryAction>
        </ListItem>
      );
    });
    return items;
  }

  const list_activitys = getActivitysItem();
  const loader = <Grid key={-1} item xs={12}><div className="loader"><img alt="loading" src={loading} /></div>;</Grid>

  return (
    <>
      <Tabs
        value={values.tab_id}
        indicatorColor="primary"
        textColor="primary"
        onChange={handleChange}
        className={classes.tabsPannel}
        aria-label="disabled tabs example"
      >
        <Tab value="general" label="Visão geral" />
        <Tab value="network" label="Rede" />
        <Tab value="side_dish" label="Acompanhamento" />
        <Tab value="activity" label="Atividades" />

        {shareArea &&
          <Tab value="compartilhar" label="Compartilhar" />
        }
        <Tab value="Logs" label="Logs" />
      </Tabs>

      <TabPanel value={values.tab_id} index="general">
        <GeneralNetwork />
      </TabPanel>

      <TabPanel value={values.tab_id} index="network">
        <EditNetwork id={props.match.params.id} />
      </TabPanel>

      <TabPanel value={values.tab_id} index="side_dish">
        <SideDish tab_id={values.tab_id} />
      </TabPanel>

      <TabPanel value={values.tab_id} index="Logs">
        <LogWindow network_id={values.network_id} />
      </TabPanel>

      {shareArea &&
        <TabPanel value={values.tab_id} index="compartilhar">
          <SharedPannel network={values.network_id} />
        </TabPanel>}

      <TabPanel value={values.tab_id} index="activity">
        <NewQuestion id_network={props.match.params.id} />

        <Grid container >
          <div className={"infiniteScroll"}>
            <InfiniteScroll
              pageStart={0}
              loadMore={loadItems}
              hasMore={values.hasMoreItems}
              loader={loader}
              useWindow={false}
              getScrollParent={() => document.getElementById('mainPanel')}
            >
              <List
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={
                  <ListSubheader component="div" id="nested-list-subheader">
                    Atividades
                                </ListSubheader>
                }
                className={classes.root}
              >
                {list_activitys}
              </List>
            </InfiniteScroll>
          </div>
        </Grid>
      </TabPanel>
    </>
  );
}
export default ResourcesNetwork;