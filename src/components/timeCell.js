import React from "react";

export function TimeCell(props) {
  const { time } = props;
  if (time) {
    return <td className="time-cell">{time}</td>;
  }
}
