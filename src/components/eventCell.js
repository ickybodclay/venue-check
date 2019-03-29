import React, { Component } from "react";

export class EventCell extends Component {
  render() {
    const event = this.props.event;
    if (event) {
      return <td className="busy-cell">{event.name}</td>;
    }

    return <td className="event" />;
  }
}
