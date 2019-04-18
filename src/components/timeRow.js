import React, { useEffect, useState } from "react";
export function TimeRow(props) {
  const { time, children, selectedDate } = props;
  const [ currentTime, setCurrentTime ] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(tick, 5 * 1000);
    return function unmount() {
      clearInterval(intervalId);
    }
  });

  function tick() {
    setCurrentTime(new Date());
  }

  function sameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();
  }

  if (sameDay(currentTime, selectedDate) && time.hour == currentTime.getHours()) {
    return <tr style={ {border : "solid 3px orangered", backgroundColor : "orange"} } >
      {children}
    </tr>;
  }
  return <tr>{children}</tr>;
}
