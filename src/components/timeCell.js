import React, { Component } from "react";

export class TimeCell extends Component {
  render() {
    const time = this.props.time;
    return <td className="time-cell">{time}</td>;
  }
}
