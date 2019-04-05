import React, { Component } from "react";

export class TimeRow extends Component {
  render() {
    return <tr>{this.props.children}</tr>;
  }
}
