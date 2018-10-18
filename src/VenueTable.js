import React, { Component } from 'react';

class VenueTable extends Component {
  render() {
    let columns = this.props.venueData.map(venue => {
      return <VenueCell key={venue.name} venueName={venue.name} />
    });

    let rows = this.props.timeData.map(time => {
      let children = [];
      children.push(<TimeCell key={time} time={time} />);
      let events = this.props.venueData.map(venue => {
        if (this.props.eventsData.hasOwnProperty(venue.name)) {
          let eventFound = null
          this.props.eventsData[venue.name].forEach(event => {
            if(event.times.includes(time)) {
              eventFound = event
            }
          });
          if (eventFound) {
            return <EventCell key={venue.name + time} event={eventFound} />
          }
          return <EventCell key={venue.name + time} event={null} />
        }
        else {
          return <EventCell key={venue.name + time} event={null} />
        }
      });
      children.push(events);

      return <TimeRow key={time} children={children} />
    });

    return (
      <table className="venue-table" align="center">
        <thead>
          <tr><th />{columns}</tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
}

class TimeRow extends Component {
  render() {
    return (
      <tr>{this.props.children}</tr>
    )
  }
}

class VenueCell extends Component {
  render() {
    const venueName = this.props.venueName
    return (
      <th>{venueName}</th>
    );
  }
}

class TimeCell extends Component {
  render() {
    const time = this.props.time
    return (
      <td className="time-cell">{time}</td>
    );
  }
}

class EventCell extends Component {
  render() {
    const event = this.props.event
    if (event) {
      return (
        <td className="busy-cell">{event.name}</td>
      );
    }

    return (<td className="event" />)
  }
}

export default VenueTable;