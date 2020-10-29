import {
    drawerWidth,
    transition,
    container
  } from "assets/jss/style.jsx";
  
  const appStyle = theme => ({
    wrapper: {
      position: "relative",
      top: "0",
      height: "100vh"
    },
    mainPanel: {
      [theme.breakpoints.up("md")]: {
        width: `calc(100% - ${drawerWidth}px)`
      },
      overflow: "auto",
      position: "relative",
      float: "right",
      ...transition,
      maxHeight: "100%",
      height: '100%',
      width: "100%",
      overflowScrolling: "touch"
    },
    fullcontent: {
      marginTop: "60px",
      boxShadow: '0',
      height: "calc(100vh - 60px)",
    },
    content: {
      marginTop: "70px",
      padding: "30px 15px",
      minHeight: "calc(100vh - 123px)"
    },
    container,
    map: {
      marginTop: "70px",
    }
  });
  
  export default appStyle;
  