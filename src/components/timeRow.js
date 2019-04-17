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

  function getHourLabel(index) {
    if (index < 0) {
      index = timeData.length;
    }
    else if (index >= timeData.length) {
      index = 0;
    }
    return timeData[index];
  }

  function getHourIndex(time) {
    return time.getHours() == 0 ? 23 : time.getHours() - 1;
  }

  if (sameDay(time, currentDate) && label === getHourLabel(getHourIndex(time))) {
    return <tr style={ {border : "solid 3px orangered", backgroundColor : "orange"} } >
      {children}
    </tr>;
  }
  return <tr>{children}</tr>;
}
