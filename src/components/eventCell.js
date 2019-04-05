import React from "react";

//SFC (Stateless Functional Component)
export function EventCell(props) {
  const { event } = props;
  if (event) {
    return <td className="busy-cell">{event.name}</td>;
  } else {
    return <td className="event" />;
  }
}
