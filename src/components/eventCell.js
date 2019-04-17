import React from "react";

//SFC (Stateless Functional Component)
export function EventCell(props) {
  const { event, rowspan, width } = props;
  if (event) {
    return <td className="busy-cell" rowSpan={rowspan || 1} width={`${width}%`}>{event.name}</td>;
  } else {
    return <td className="event" width={`${width}%`}/>;
  }
}
