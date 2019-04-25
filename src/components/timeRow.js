import React, { useEffect, useState } from "react";

//utility
import { sameDay } from "../utils/dateUtils";

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
  
  if (sameDay(currentTime, selectedDate) && time.hour == currentTime.getHours()) {
    return <tr style={ {border : "solid 3px orangered", backgroundColor : "orange"} } >
      {children}
    </tr>;
  }
  return <tr>{children}</tr>;
}
