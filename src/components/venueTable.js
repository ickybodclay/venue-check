import React from "react";

// components
import { EventCell } from "./eventCell";
import { TimeCell } from "./timeCell";
import { VenueCell } from "./venueCell";
import { TimeRow } from "./timeRow";

export function VenueTable(props) {
  const { showDelete, venueData, timeData, currentDate, eventsData } = props;

  const handleDeleteClicked = index => {
    const { handleRemoveVenue } = props;
    handleRemoveVenue(index);
  };

  const columns = venueData.map((venue, index) => {
    return (
      <VenueCell
        key={venue.name}
        venueName={venue.name}
        venueIndex={index}
        showDelete={showDelete}
        onDeleteClicked={handleDeleteClicked}
      />
    );
  });

  const rows = timeData.map(time => {
    let now = new Date();
    const highlight = (
      sameDay(currentDate, now) &&
      time === getHourTimeLabel(now))
    let children = [];
    children.push(<TimeCell key={time} time={time} />);
    const events = venueData.map(venue => {
      if (eventsData.hasOwnProperty(venue.name)) {
        let eventFound = null;
        eventsData[venue.name].forEach(event => {
          if (event.times.includes(time)) {
            eventFound = event;
          }
        });
        if (eventFound) {
          return <EventCell key={venue.name + time} event={eventFound} />;
        }
        return <EventCell key={venue.name + time} event={null} />;
      } else {
        return <EventCell key={venue.name + time} event={null} />;
      }
    });
    children.push(events);
    return <TimeRow key={time} children={children} highlight={highlight}/>;
  });

  function sameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();
  }

  function getHourTimeLabel(time) {
    return timeData[time.getHours() == 0 ? 23 : time.getHours() - 1];
  }

  return (
    <table className="venue-table" align="center">
      <thead>
        <tr>
          <th />
          {columns}
        </tr>
      </thead>
      <tbody>
        {rows}
      </tbody>
    </table>
  );
}
