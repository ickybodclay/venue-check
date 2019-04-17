import React, { useEffect, useState } from "react";
export function TimeRow(props) {
  const { label, children, currentDate, timeData } = props;
  const [ time, setTime ] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(tick, 1000);
    return function unmount() {
      clearInterval(intervalId);
    }
  });

  function tick() {
    setTime(new Date());
  }

  function sameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();
  }

  function getHourLabel(time) {
    return timeData[time.getHours() == 0 ? 23 : time.getHours() - 1];
  }

  if (sameDay(time, currentDate) && label === getHourLabel(time)) {
    return <tr style={ {border : "solid 3px orangered", backgroundColor : "orange"} } >
      {children}
    </tr>;
  }
  return <tr>{children}</tr>;
}
