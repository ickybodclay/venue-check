import React from "react";

//SFC (Stateless Functional Component)
export function EventCell(props) {
  const { event, rowspan } = props;
  if (event) {
    return <td className="busy-cell" rowSpan={rowspan || 1}>{event.name}</td>;
  } else {
    return <td className="event" />;
  }
}
