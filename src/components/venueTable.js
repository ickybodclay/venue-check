import React from "react";

// components
import { EventCell } from "./eventCell";
import { TimeCell } from "./timeCell";
import { VenueCell } from "./venueCell";
import { TimeRow } from "./timeRow";

export function VenueTable(props) {
  const {
    showDelete,
    venueData,
    timeData,
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
    const { timeData, venueData, eventsData } = props;

    return timeData.map(time => {
      const rowDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        time.hour,
        0,
        0,
        0
      );
      console.log(`loading row [${rowDate}] ${time.hour}`);
      const cellwidth = 100 / venueData.length; // percent wide
      let children = [];
      children.push(<TimeCell key={time.label} time={time.label} />);
      const events = venueData.map(venue => {
        if (eventsData.hasOwnProperty(venue.name)) {
          let eventFound = null;
          let eventStart = false;
          eventsData[venue.name].some(event => {
            if (
              event.startTime &&
              event.endTime &&
              rowDate.getTime() >= event.startTime.getTime() &&
              rowDate.getTime() < event.endTime.getTime()
            ) {
              eventFound = event;
              eventStart =
                event.startTime.getDate() < rowDate.getDate()
                  ? time.hour === 0
                  : rowDate.getHours() === event.startTime.getHours();
              return true;
            }
            return false;
          });
          if (eventFound) {
            if (eventStart) {
              let endHour =
                rowDate.getDate() === eventFound.endTime.getDate()
                  ? eventFound.endTime.getHours()
                  : 24;
              let rownSpan = endHour - time.hour;
              return (
                <EventCell
                  key={venue.name + time.label}
                  event={eventFound}
                  rowspan={rownSpan}
                  width={cellwidth}
                />
              );
            }
            return null;
          }
          return (
            <EventCell
              key={venue.name + time.label}
              event={null}
              width={cellwidth}
            />
          );
        } else {
          return (
            <EventCell
              key={venue.name + time.label}
              event={null}
              width={cellwidth}
            />
          );
        }
      });
      children.push(events);
      return (
        <TimeRow
          key={"row-" + time.label}
          time={time}
          children={children}
          selectedDate={selectedDate}
        />
      );
    });
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
        <Rows
          timeData={timeData}
          venueData={venueData}
          eventsData={eventsData}
        />
      </tbody>
    </table>
  );
}
