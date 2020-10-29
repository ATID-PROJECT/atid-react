import React from "react";
import { render } from "react-dom";
import "./index.css";
import App from "./App";
import "assets/base.css";
import "assets/bootstrap.css";
import "assets/global.css";

import { Provider } from "react-redux";
import { store } from "./_helpers";

import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#195FB5',
      main: '#1859A8',
      dark: '#144B8F',
      contrastText: '#fff',
    },
  },
  overrides: {
    MuiTableCell: {
      root: {
        fontSize: "1.175rem",
      },
      head: {
        fontSize: "1.10rem",
      }
    },
    PrivateNotchedOutline:{
      root:{
        borderRadius: 50,
      },
    },
    MuiTypography: {
        caption: {
            fontSize: "1.15rem",
        },
        gutterBottom:{
          color: "#69359d",
        },
    },
    MuiTableRow:{
        head:{
            backgroundColor: '#80808030',
        },
    },
    MuiTablePagination:{
        root:{
            fontSize: "1.15rem",
        },
    },

    
  },
});

render(
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <App />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
