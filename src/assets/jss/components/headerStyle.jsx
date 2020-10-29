import {
    container,
    defaultFont,
    primaryColor,
    defaultBoxShadow,
    infoColor,
    successColor,
    warningColor,
    dangerColor
  } from "assets/jss/style.jsx";
  
  const headerStyle = theme => ({
    appBar: {
      backgroundColor: "transparent",
      boxShadow: "none",
      borderBottom: "0",
      marginBottom: "0",
      position: "absolute",
      width: "100%",
      zIndex: "1029",
      color: "#555555",
      border: "0",
      borderRadius: "3px",
      transition: "all 150ms ease 0s",
      minHeight: "50px",
      display: "block"
    },
    container: {
      ...container,
      minHeight: "50px",
      borderBottom: "1px solid rgba(0, 40, 100, 0.12)",
      background: '#fff',
    },
    flex: {
      flex: 1
    },
    title: {
      ...defaultFont,
      lineHeight: "30px",
      fontSize: "18px",
      borderRadius: "3px",
      textTransform: "none",
      color: "inherit",
      "&:hover,&:focus": {
        background: "transparent"
      }
    },
    appResponsive: {
      top: "8px"
    },
    primary: {
      backgroundColor: primaryColor,
      color: "#FFFFFF",
      ...defaultBoxShadow
    },
    info: {
      backgroundColor: infoColor,
      color: "#FFFFFF",
      ...defaultBoxShadow
    },
    success: {
      backgroundColor: successColor,
      color: "#FFFFFF",
      ...defaultBoxShadow
    },
    warning: {
      backgroundColor: warningColor,
      color: "#FFFFFF",
      ...defaultBoxShadow
    },
    danger: {
      backgroundColor: dangerColor,
      color: "#FFFFFF",
      ...defaultBoxShadow
    }
  });
  
  export default headerStyle;
  