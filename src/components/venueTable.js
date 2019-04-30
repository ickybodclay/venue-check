import React, { useEffect } from "react";

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

    return (
      <tr>
        <th />
        {venueData.map((venue, index) => {
          return (
            <VenueCell
              key={venue.name}
              venueName={venue.name}
              venueIndex={index}
              showDelete={showDelete}
              onDeleteClicked={handleRemoveVenue}
            />
          );
        })}
      </tr>
    );
  }

  function Rows(props) {
    const { venueData, eventsData, selectedDate } = props;

    let rows = venueData.map(venue => {
      return (
        <td key={venue.name}>
          <FullCalendar
            defaultView="timeGridDay"
            defaultDate={selectedDate}
            header={null}
            contentHeight="auto"
            plugins={[dayGridPlugin, timeGridPlugin]}
            events={eventsData[venue.name]}
            nowIndicator="true"
            timeZone="local"
          />
        </td>
      );
    });

    return (
      <tr>
        <td />
        {rows}
      </tr>
    );
  }

  return (
    <table className="venue-table" align="center">
      <thead>
        <Columns
          venueData={venueData}
          showDelete={showDelete}
          handleRemoveVenue={handleRemoveVenue}
        />
      </thead>
      <tbody>
        <Rows
          venueData={venueData}
          eventsData={eventsData}
          selectedDate={selectedDate}
        />
      </tbody>
    </table>
  );
}
