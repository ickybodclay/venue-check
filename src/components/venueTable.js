import React, { Component } from "react";

// components
import { EventCell } from "./eventCell";
import { TimeCell } from "./timeCell";
import { VenueCell } from "./venueCell";
import { TimeRow } from "./timeRow";

export class VenueTable extends Component {
  constructor() {
    super();
    this.state = {
      showDelete: false
    };
  }

  toggleVenueDelete() {
    this.setState({
      showDelete: !this.state.showDelete
    });
  }

  handleDeleteClicked(index) {
    this.props.handleRemoveVenue(index);
    this.toggleVenueDelete();
  }

  render() {
    let columns = this.props.venueData.map((venue, index) => {
      return (
        <VenueCell
          key={venue.name}
          venueName={venue.name}
          venueIndex={index}
          showDelete={this.state.showDelete}
          onDeleteClicked={this.handleDeleteClicked.bind(this)}
        />
      );
    });

    let rows = this.props.timeData.map(time => {
      let children = [];
      children.push(<TimeCell key={time} time={time} />);
      let events = this.props.venueData.map(venue => {
        if (this.props.eventsData.hasOwnProperty(venue.name)) {
          let eventFound = null;
          this.props.eventsData[venue.name].forEach(event => {
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

      return <TimeRow key={time} children={children} />;
    });

    return (
      <table className="venue-table" align="center">
        <thead>
          <tr>
            <th />
            {columns}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
}
