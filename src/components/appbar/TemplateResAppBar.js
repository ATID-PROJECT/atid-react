import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  AppBar, Toolbar, Typography, List, ListItem,
  withStyles, Grid, SwipeableDrawer
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import Button from '@material-ui/core/Button';
import logo from "assets/img/logo.png"
import { Link } from "react-router-dom";


const styleSheet = {
    header:{
        background: "#4c5273 !important",
    },
    list : {
        width : 200,
    },
    padding : {
        padding: "10px 25px",
        cursor : "pointer",
        color: "#fff",
    },

    sideBarIcon : {
        padding : 0,
        color : "white",
        cursor : "pointer",
    }
}

class TemplateResAppBar extends Component{
  
  constructor(props){
    super(props);
    this.state = {drawerActivate:false, drawer:false};
    this.createDrawer = this.createDrawer.bind(this);
    this.destroyDrawer = this.destroyDrawer.bind(this);
  }

  UNSAFE_componentWillMount(){
    if(window.innerWidth <= 600){
      this.setState({drawerActivate:true});
    }

    window.addEventListener('resize',()=>{
      if(window.innerWidth <= 600){
        this.setState({drawerActivate:true});
      }
      else{
        this.setState({drawerActivate:false})
      }
    });
  }

  //Small Screens
  createDrawer(){
    const { classes } = this.props;
    
    return (
      <div>
        <AppBar className={classes.header}>
          <Toolbar>
            <Grid container direction = "row" justify = "space-between" alignItems="center">
              <MenuIcon
                className = {this.props.classes.sideBarIcon}
                onClick={()=>{this.setState({drawer:true})}} />

              <Typography color="inherit" variant = "headline">ATID</Typography>
              <Typography color="inherit" variant = "headline"></Typography>
              
            </Grid>
          </Toolbar>
        </AppBar>

        <SwipeableDrawer
         open={this.state.drawer}
         onClose={()=>{this.setState({drawer:false})}}
         onOpen={()=>{this.setState({drawer:true})}}>

           <div
             tabIndex={0}
             role="button"
             onClick={()=>{this.setState({drawer:false})}}
             onKeyDown={()=>{this.setState({drawer:false})}}>

            <List className = {this.props.classes.list}>
               <ListItem key = {1} button divider> INÍCIO </ListItem>
               <ListItem key = {2} button divider> SOBRE </ListItem>
               <ListItem key = {3} button divider> CONTATO </ListItem>
             </List>

         </div>
       </SwipeableDrawer>

      </div>
    );
  }

  //Larger Screens
  destroyDrawer(){
    const {classes} = this.props
    return (
      <AppBar>
        <Toolbar>
          <Typography variant = "headline" style={{flexGrow:1, textAlign: 'left'}} color="inherit" >
                <Link to="/">
                    <img style={{width: 50, top: 11}} src={logo} className="logo" />
                </Link>
          </Typography>
     
          <Link to="/">
            <Button color="inherit" className={classes.padding}>INÍCIO</Button>
          </Link>

          <Link to="#">
            <Button color="inherit" className={classes.padding}>PROJETOS</Button>
          </Link>

          <Link to="#">
            <Button color="inherit" className={classes.padding}>SOBRE</Button>
          </Link>

          <Link to="#">
            <Button color="inherit" className={classes.padding}>CONTATO</Button>
          </Link>
        </Toolbar>
      </AppBar>
    )
  }

  render(){
    return(
      <div>
        {this.state.drawerActivate ? this.createDrawer() : this.destroyDrawer()}
      </div>
    );
  }
}

TemplateResAppBar.propTypes = {
  classes : PropTypes.object.isRequired
};



export default withStyles(styleSheet)(TemplateResAppBar);