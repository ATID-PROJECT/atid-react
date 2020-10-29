
import React, {Component} from 'react';

import { Link } from "react-router-dom";

class RouterLink extends Component {
    constructor() {
      super();
  
      this.onClick = this.onClick.bind(this);
    }
  
    onClick(e) {
      if (this.props.hasSubMenu) this.props.toggleSubMenu(e);
      else {
  
        this.props.activateMe({
          selectedMenuLabel: this.props.label,
        });
      }
    }
  
    render() {
      const newLocation = this.props.to;

      return (
        <Link to={newLocation} className="metismenu-link" onClick={this.onClick}>
          {this.props.children}
        </Link>
      );
    }
  };

export default RouterLink;