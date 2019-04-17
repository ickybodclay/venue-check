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
    const cellwidth = 100 / venueData.length; // percent wide
    let children = [];
    children.push(<TimeCell key={time} time={time} />);
    const events = venueData.map(venue => {
      if (eventsData.hasOwnProperty(venue.name)) {
        let eventFound = null;
        let eventStart = false;
        eventsData[venue.name].forEach(event => {
          if (event.times.includes(time)) {
            eventFound = event;
            eventStart = event.times.indexOf(time) == 0;
          }
        });
        if (eventFound) {
          if (eventStart) {
            return <EventCell key={venue.name + time} event={eventFound} rowspan={eventFound.times.length} width={cellwidth} />;
          }
          return null;
        }
        return <EventCell key={venue.name + time} event={null} width={cellwidth} />;
      } else {
        return <EventCell key={venue.name + time} event={null} width={cellwidth} />;
      }
    });
    children.push(events);
    return <TimeRow key={time} label={time} children={children} currentDate={currentDate} timeData={timeData} />;
  });

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
