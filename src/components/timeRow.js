import React from "react";
export function TimeRow(props) {
  const { children, highlight } = props;
  if (highlight) {
    return <tr style={ {border : "solid 3px orangered", backgroundColor : "orange"} }>{children}</tr>;
  }
  return <tr>{children}</tr>;
}
