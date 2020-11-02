import React, { Fragment, Component, useState } from "react";

import InfiniteScroll from "react-infinite-scroller";
import loading from "assets/img/loading.gif";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import { userService } from "_services";
import $ from "jquery";
import DeleteNetwork from "components/network/DeleteNetwork";
import "assets/css/infiniteScroll.css";
import { history } from '_helpers';

import Grid from "@material-ui/core/Grid";
import ImportWindow from "./Modal/ImportWindow";
import withStyles from "@material-ui/core/styles/withStyles";

import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";

import { Typography, IconButton } from "@material-ui/core";
import { Link } from "react-router-dom";
import { dialogActions } from "_actions";
import { connect } from "react-redux";

import SchoolIcon from "@material-ui/icons/School";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import Connection from "../components/network/Connection";
import CourseDialog from "../components/network/CourseDialog";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

const CourseRow = (props) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);

  return (
    <div className="row" id={`${props.id}`}>
      <div className="col-10">
        <Link to={`/painel/cursos/editar/${props.id}`}>
          <div style={{ position: "relative", cursor: "pointer" }}>
            <div
              className="row mb-1 border-list"
              style={{ padding: "12px 10px" }}
            >
              <div className="col-12 col-md-4">
                <SchoolIcon style={{ marginRight: 20, color: "#777" }} />
                {props.name}
              </div>
              <div className="col-12 col-md-3">{props.last_change}</div>
              <div className="col-12 col-md-2" style={{ paddingLeft: 30 }}>
                {props.students}
              </div>
              <div className="col-12 col-md-3">
                {props.connected ?
                  <span style={{ background: '#009fff', color: '#fff', padding: '3px 6px', }}>Conectado</span>
                  :
                  <span style={{ background: 'rgb(161, 169, 174)', color: '#fff', padding: '3px 6px', }}>Não conectado</span>
                }
              </div>
            </div>
          </div>
        </Link>
      </div>
      <div>
        <div className="col-12 col-md-2">
          <Dropdown isOpen={dropdownOpen} toggle={toggle}>
            <DropdownToggle caret style={{ background: '#2f4253' }}>Configurar</DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={props.duplicateNetwork}>Duplicar</DropdownItem>
              <DropdownItem onClick={props.handleRemove}>Apagar</DropdownItem>
              <DropdownItem onClick={props.openModalConnection}>Conectar</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

library.add(fab, fas, far);

const styles = (theme) => ({
  card_item: {
    "&:hover": {
      cursor: "pointer",
      boxShadow: "0 1px 4px 0 rgba(0, 0, 0, 0.14)",
    },
  },
  root: {
    marginBottom: 10,
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: "100%",
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
    fontSize: "15px",
    padding: "6px 5px",
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
  errorMessage: {
    margin: 0,
    paddingTop: 15,
  },
});

class Networks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasMoreItems: true,
      hasMoreValue: true,
      tracks: [],
      clear: false,

      open: false,
      open_delete_modal: false,
      error_connection: false,
      ConnectionWindow: false,
      create_course_modal: false,
      selectedNetwork: {},
      id_network: "",
      update_attr: "",

      code_network: "",
      name_network: "",
      current_time: "",
    };

    this.handleChange = this.handleChange.bind(this);

    const that = this;
    userService.sendGETRequest("/getTime", {}, function (result) {
      that.setState({ current_time: result["current_time"] });
    });
  }

  handleChange = (name) => (event) => {
    this.setState({ [name]: event.target.value });
  };

  loadItems(page) {
    if (this.state.hasMoreValue) this.getActivity(page);
  }

  getActivity(page) {
    let user = JSON.parse(localStorage.getItem("user"));
    const that = this;
    const requestOptions = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + user.token,
      },
    };
    return fetch(
      `${process.env.REACT_APP_API_URL}/users/activity/getAll?` +
      $.param({
        page: page,
        page_size: 3,
        code: that.state.code_network,
        name: that.state.name_network,
      }),
      requestOptions
    )
      .then(userService.handleResponse)
      .then((response) => {
        if (response.length === 0) {
          that.setState({ hasMoreItems: false });
          if (page === 1) that.setState({ clear: true });
        }

        if (that.state.tracks.length > 0 && page === 1) {
          that.setState({ tracks: [] });
        }

        if (that.state.hasMoreValue) {
          var tracks = that.state.tracks;
          var array = Array.from(
            Object.keys(response),
            (k) => response[k]["activity"]
          );

          tracks.concat(array);
          array.forEach(function name(params) {
            tracks.push(params);
          });
          that.setState({ tracks: tracks });
        }

        return response;
      });
  }

  openMakeCourse(network_id) {
    this.props.openDialogConfig("create_course", null, network_id);
  }

  openConnectionWindow(network_id, url, token) {
    this.props.openDialogConfig("connection_network", null, network_id);
    this.setState({
      ava_address: url,
      access_token: token,
    });
  }

  getCardItems() {
    var items = [];
    const that = this;
    const { classes } = this.props;

    if (this.state.clear) {
      items.push(
        <Typography className={classes.errorMessage}>
          Você não possuí nenhuma rede criada.
        </Typography>
      );
    }

    this.state.tracks.map((track, i) => {
      const url = track["url"];
      const token = track["token"];
      items.push(
        <div style={{ width: "100%" }}>
          <CourseRow
            key={i}
            id={track["id"]}
            name={track["name"]}
            last_change="25/06/2020"
            students="85"
            connected={track['course_id'] != null}
            handleRemove={() => {
              that.setState({ selectedNetwork: track, open_delete_modal: true })
            }}
            openModalConnection={() => {
              that.openConnectionWindow(track["id"], url, token);
            }}
            duplicateNetwork={() => {
              setTimeout(() => {
                history.push(`/painel/cursos/${track["id"]}/duplicar`);
              }, 500);
            }}
          />
        </div>
      );
      return null;
    });
    return items;
  }

  handleChangeState = (name) => (event) => {
    this.setState({ [name]: event.target.value });

    this.scroll.pageLoaded = 0;
    this.setState({
      hasMoreItems: true,
      clear: false,
      tracks: [],
      hasMoreValue: true,
    });
  };

  render() {
    const { classes } = this.props;
    const loader = (
      <div key={0} className="loader">
        <img src={loading} alt="loading" />
      </div>
    );

    var items = this.getCardItems();

    return (
      <Fragment>
        <div>
          <p>Pesquisar redes</p>
        </div>
        <Paper className={classes.root}>
          <InputBase
            className={classes.input}
            placeholder="Código da rede"
            value={this.state.code_network}
            onChange={this.handleChangeState("code_network")}
            inputProps={{ "aria-label": "Código da rede" }}
          />
          <IconButton className={classes.iconButton} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Paper>
        <ImportWindow />
        <Grid container>
          <div className={"infiniteScroll"}>
            <InfiniteScroll
              pageStart={0}
              loadMore={this.loadItems.bind(this)}
              hasMore={this.state.hasMoreItems}
              loader={loader}
              useWindow={false}
              ref={(scroll) => {
                this.scroll = scroll;
              }}
              getScrollParent={() => document.getElementById("mainPanel")}
            >
              {!this.state.clear && items.length > 0 && false && (
                <Grid item xs={12}>
                  <p style={{ margin: 0, paddingTop: 15 }}>
                    Um total de {items.length} redes
                  </p>
                </Grid>
              )}
              <div style={{ width: "100%" }}>
                <div className="row mb-2 mt-4" style={{ padding: "5px 10px" }}>
                  <div
                    className="col-12 col-md-4 font-weight-bold"
                    style={{ ...styles.title, ...{ paddingLeft: 10 } }}
                  >
                    <ExpandLessIcon style={{ fontSize: 27, marginRight: 18 }} />{" "}
                    Nome do curso
                  </div>
                  <div
                    className="col-12 col-md-3 font-weight-bold d-md-none"
                    style={styles.title}
                  >
                    Última alteração
                  </div>
                  <div
                    className="col-12 col-md-2 font-weight-bold d-md-none"
                    style={styles.title}
                  >
                    Alunos
                  </div>
                  <div
                    className="col-12 col-md-3 font-weight-bold d-md-none"
                    style={styles.title}
                  >
                    Status
                  </div>
                </div>
              </div>
              {items}
            </InfiniteScroll>
          </div>
        </Grid>

        <Connection
          access_token={this.state.access_token}
          ava_address={this.state.ava_address}
          handleChange={this.handleChange}
        />

        <DeleteNetwork
          open={this.state.open_delete_modal}
          id_network={this.state.selectedNetwork['id']}
          name_network={this.state.selectedNetwork['name']}
          handleClose={() => {
            this.setState({ open_delete_modal: false })

          }}
        />

        <CourseDialog />
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({ dialog: state.dialog });

const mapDispatchToProps = (dispatch) => ({
  openDialogConfig(name, uuid, id_network) {
    dispatch(dialogActions.openDialog(name, uuid, id_network));
  },
});

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(Networks)
);
