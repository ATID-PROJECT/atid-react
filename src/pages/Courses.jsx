import React, { Fragment, Component } from "react";

import AccessTime from "@material-ui/icons/AccessTime";

import { userService } from '_services';
import $ from 'jquery'; 
import moment from 'moment';
import "assets/css/infiniteScroll.css";

import Grid from '@material-ui/core/Grid';

import Card from "components/Card/Card.jsx";
import ListCourses from "components/tables/ListCourses.jsx";
import DeleteNetwork from "components/network/DeleteNetwork";
import withStyles from "@material-ui/core/styles/withStyles";

import { CardContent, Typography, CardActions, IconButton, Tooltip } from "@material-ui/core";
import { Link } from "react-router-dom";
import { dialogActions } from "_actions";
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import Connection from "../components/network/Connection";
import CourseDialog from "../components/network/CourseDialog";

library.add(fab, fas, far);

const styles = theme => ({
   card_item:{
       '&:hover': {
           cursor: "pointer",
           boxShadow: "0 1px 4px 0 rgba(0, 0, 0, 0.14)",
       }
   },
});

class Courses extends Component {
   constructor(props){
      super(props);
      this.state = { 
          hasMoreItems: true,
          hasMoreValue: true,
          tracks: [],
          clear: false,

          open: false,
          error_connection: false,
          ConnectionWindow: false,
          create_course_modal: false,
          id_network: "",
          update_attr: "",

          code_network: "",
          name_network: "",
          current_time: "",
      }

      this.handleChange = this.handleChange.bind(this);

      const that = this;
      userService.sendGETRequest('/getTime', {},function(result){
         that.setState({current_time: result['current_time']})
     });
   }

   handleChange = name => event => {
      this.setState({ [name]: event.target.value });
  };

   loadItems(page) {
      if ( this.state.hasMoreValue)
          this.getActivity(page);
   }

   getActivity(page) {
      let user = JSON.parse(localStorage.getItem('user'));
      const that = this;
      const requestOptions = {
          method: 'GET',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + user.token,
          },
      };
      return fetch(`${process.env.REACT_APP_API_URL}/users/activity/getAll?`+$.param({
         'page': page, 'page_size': 3, 'code': that.state.code_network,'name': that.state.name_network }), requestOptions)
          .then(userService.handleResponse)
          .then(response => {
              if(response.length === 0){
                  that.setState({ hasMoreItems: false});
                  if(page===1) that.setState({ clear: true});
              }

              if( that.state.tracks.length > 0 && page===1)
              {
               that.setState({ tracks: []})
              }


              if ( that.state.hasMoreValue)
              {
                  var tracks = that.state.tracks;
                  var array = Array.from(Object.keys(response), k=>response[k]["activity"]);

                  tracks.concat( array );
                  array.forEach( function name(params) {
                      tracks.push( params );
                  })
                  that.setState({ tracks: tracks });
              }
              
              return response;
          });
      }

   getTimeDifference = (time) => {
      var old_date = new moment(time);
      var c_date = new moment( this.state.current_time );

      var anos = c_date.diff(old_date, 'years');
      var meses = c_date.diff(old_date, 'months');
      var dias = c_date.diff(old_date, 'days');
      var hours = c_date.diff(old_date, 'hours');
      var minutos = c_date.diff(old_date, 'minutes');
      
      if(anos)
            return anos === 1 ? anos+" ano" : anos + " anos";
      else if(meses)
            return meses === 1 ? meses+" mês" : meses + " meses";
      else if(dias)
            return dias === 1 ? dias+" dia" : dias + " dias";
      else if(hours)
            return hours === 1 ? hours+" hora" : hours + " horas";
      else if(minutos)
            return minutos === 1 ? minutos+" minuto" : minutos + " minutos";
      return "0 minutos";
 
     }

   openMakeCourse( network_id )
   {
      this.props.openDialogConfig("create_course", null, network_id);    
   }

   openConnectionWindow( network_id, url, token )
   {
      this.props.openDialogConfig("connection_network", null, network_id);
      this.setState({
         ava_address: url,
         access_token: token,
      });
   }

   getCardItems() {
      var items = [];
      const { classes } = this.props;

      if(this.state.clear)
      {
         items.push(<Typography className={classes.errorMessage}>Você não possuí nenhuma rede criada.</Typography>);
      }

      this.state.tracks.map((track, i) => {
         const url = track['url'];
         const token = track['token'];
         const has_connection = url && token; 
         items.push(
            <Grid id={track['id']} xs={12} item md={4} style={{padding: 12}} key={i}>
               <div className={classes.card_item}>
               <Card className={classes.card} style={{ marginBottom: 10, }}>
                  <CardContent style={{paddingBottom: 0}}>
                     <Typography className={classes.title} color="textSecondary" gutterBottom>
                           {track['id']}
                     </Typography>
                     <Typography variant="h5" component="h2">
                           {track['name']}
                     </Typography>
                     <Typography component="p" style={{marginTop: 5}}>
                           <span style={{display: 'flex',alignItems: 'center', fontSize: '13px'}}><AccessTime style={{width: 16, paddingRight: 5}}/>
                              Atualizado à {this.getTimeDifference(track['updated_at'])}</span>
                     </Typography>
                  </CardContent>
                  <CardActions>
                     
                     <Link to={"/painel/cursos/editar/"+track['id']}>
                        <Tooltip title="Editar">
                           <IconButton aria-label="Share">
                              <FontAwesomeIcon color="#0B849A" size="xs" icon={['fas', 'edit']} />
                           </IconButton>
                        </Tooltip>
                     </Link>

                     <DeleteNetwork id_network={track['id']} name_network={track['name']} content={<FontAwesomeIcon color="#0B849A" size="xs" icon={['fas', 'trash']} />}/>

                     <Link to={"/painel/cursos/"+track['id']+"/recursos"}>
                        <Tooltip title="Configurar atividades">
                           <IconButton aria-label="Share">
                              <FontAwesomeIcon color="#0B849A" size="xs" icon={['fas', 'cogs']} />
                           </IconButton>
                        </Tooltip>
                     </Link>

                     <Tooltip title="Conectar Moodle">
                        <IconButton onClick={() => this.openConnectionWindow(track['id'], url, token)}  aria-label="Share">
                           <FontAwesomeIcon color="#0B849A" size="xs" icon={['fas', 'graduation-cap']} />
                        </IconButton>
                     </Tooltip>

                     {has_connection &&
                     <Tooltip title="Novo curso">
                           <IconButton onClick={() => this.openMakeCourse(track['id'])}  aria-label="Share">
                              <FontAwesomeIcon color="#000" size="xs" icon={['fas', 'plus-square']} />
                           </IconButton>
                     </Tooltip>}
                  </CardActions>
               </Card>
               </div>
            </Grid>
            );
         return null;
        }); 
        return items;
   }

   handleChangeState = name => event => {
      this.setState({[name]: event.target.value});
   
      this.scroll.pageLoaded = 0
      this.setState({hasMoreItems: true, clear: false, tracks: [], hasMoreValue: true} );
      
   }

 render() {

   return (
      <Fragment>

         <Grid container >
            <ListCourses />
         </Grid>

         <Connection
            access_token={this.state.access_token}
            ava_address={this.state.ava_address}
            handleChange={this.handleChange}
         />

         <CourseDialog />

      </Fragment>
   );
 }
}

const mapStateToProps = state => ({ dialog: state.dialog });

const mapDispatchToProps = dispatch => ({
  openDialogConfig( name, uuid, id_network ) {
    dispatch( dialogActions.openDialog( name, uuid, id_network ))
  }
})

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Courses));