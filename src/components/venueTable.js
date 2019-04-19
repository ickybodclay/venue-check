import React from "react";

// components
import { EventCell } from "./eventCell";
import { TimeCell } from "./timeCell";
import { VenueCell } from "./venueCell";
import { TimeRow } from "./timeRow";

//utility
import { isEmpty } from "../utils/jsonUtils";
import { sameDay, overlap } from "../utils/dateUtils";

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

    if (isEmpty(eventsData)) {
      return null;
    }

    return timeData.map(time => {
      const rowStartDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        time.hour,
        0,
        0,
        0
      );
      const rowEndDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        time.hour + 1,
        0,
        0,
        0
      );
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
              overlap(rowStartDate, rowEndDate, event.startTime, event.endTime)
            ) {
              eventFound = event;
              eventStart = sameDay(rowStartDate, event.startTime) 
                ? rowStartDate.getHours() == event.startTime.getHours()
                : rowStartDate.getHours() == 0;
              return true;
            }
            return false;
          });
          if (eventFound) {
            if (eventStart) {
              let startHour = sameDay(rowStartDate, eventFound.startTime)
                ? eventFound.startTime.getHours()
                : 0;
              let endHour = sameDay(rowStartDate, eventFound.endTime)
                ? eventFound.endTime.getHours()
                : 24;
              let rowSpan = endHour - startHour;
              return (
                <EventCell
                  key={venue.name + time.label}
                  event={eventFound}
                  rowspan={rowSpan}
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
