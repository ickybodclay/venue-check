import React from "react";

// components
import { VenueCell } from "./venueCell";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";

// style
import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";

export function VenueTable(props) {
  const {
    showDelete,
    venueData,
    selectedDate,
    eventsData,
    handleRemoveVenue
  } = props;

  function Columns(props) {
    const { venueData, showDelete, handleRemoveVenue } = props;

    return venueData.map((venue, index) => {
      return (
        <VenueCell
          key={venue.name}
          venueName={venue.name}
          venueIndex={index}
          showDelete={showDelete}
          onDeleteClicked={handleRemoveVenue}
        />
      );
    });
  }

  function Rows(props) {
    const { venueData, eventsData } = props;

    const daygrids = venueData.map(venue => {
      return (
        <td key={venue.name}>
          <FullCalendar
            defaultView="timeGridDay"
            defaultDate={selectedDate}
            header={null}
            contentHeight="auto"
            plugins={[dayGridPlugin, timeGridPlugin]}
            events={eventsData[venue.name]}
          />
        </td>
      );
    });

    return <tr><td/>{daygrids}</tr>;
  }

  return (
    <table className="venue-table" align="center">
      <thead>
        <tr>
          <th />
          <Columns
            venueData={venueData}
            showDelete={showDelete}
            handleRemoveVenue={handleRemoveVenue}
          />
        </tr>
      </thead>
      <tbody>
        <Rows venueData={venueData} eventsData={eventsData} />
      </tbody>
    </table>
  );
}
