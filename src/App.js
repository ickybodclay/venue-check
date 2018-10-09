import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
//import ReactDOM from 'react-dom';

class App extends Component {
  constructor() {
    super();
    this.state = {
      venueData: [
        {
          id: 0,
          venueName: "Planet Ant Black Box",
          venueAddress: "2357 Caniff St, Hamtramck, MI 48212",
          eventsData: {
            "1am" : {
              id: 0,
              eventStartTime: "00:00",
              eventEndTime: "01:00",
              eventName: "Test",
              venueId: 0
            }
          }
        },
        {
          id: 1,
          venueName: "Planet Ant Black Box (2nd Floor)",
          venueAddress: "2357 Caniff St, Hamtramck, MI 48212",
          eventsData: { }
        },
        {
          id: 2,
          venueName: "Ant Hall (Main Stage)",
          venueAddress: "2320 Caniff St, Hamtramck, MI 48212",
          eventsData: { }
        },
        {
          id: 3,
          venueName: "Ant Hall (Green Room)",
          venueAddress: "2320 Caniff St, Hamtramck, MI 48212",
          eventsData: { }
        },
        {
          id: 4,
          venueName: "Ant Hall (New Bros)",
          venueAddress: "2320 Caniff St, Hamtramck, MI 48212",
          eventsData: { }
        },
        {
          id: 5,
          venueName: "Ant Hall (Front Room)",
          venueAddress: "2320 Caniff St, Hamtramck, MI 48212",
          eventsData: { }
        },
        {
          id: 6,
          venueName: "Podcast Studio",
          venueAddress: "11831 Joseph Campau Ave, Hamtramck, MI 48212",
          eventsData: { }
        }
      ],
      timeData: [
        { rowLabel: "1am" },
        { rowLabel: "2am" },
        { rowLabel: "3am" },
        { rowLabel: "4am" },
        { rowLabel: "5am" },
        { rowLabel: "6am" },
        { rowLabel: "7am" },
        { rowLabel: "8am" },
        { rowLabel: "9am" },
        { rowLabel: "10am" },
        { rowLabel: "11am" },
        { rowLabel: "12am" },
        { rowLabel: "1pm" },
        { rowLabel: "2pm" },
        { rowLabel: "3pm" },
        { rowLabel: "4pm" },
        { rowLabel: "5pm" },
        { rowLabel: "6pm" },
        { rowLabel: "7pm" },
        { rowLabel: "8pm" },
        { rowLabel: "9pm" },
        { rowLabel: "10pm" },
        { rowLabel: "11pm" },
        { rowLabel: "12pm" }
      ]
    }
  }

  render() {
    return (
      <div className="App">
        <VenueTable venueData={this.state.venueData} timeData={this.state.timeData} />
      </div>
    );
  }
}

class VenueTable extends React.Component {
  render() {
    let columns = this.props.venueData.map(venue => {
      return <VenueCell key={venue.id} venue={venue} />
    })

    const rows = [];
    for (let i = 0; i < this.props.timeData.length; i++) {
      let children = []
      let rowLabel = this.props.timeData[i].rowLabel
      children.push(<TimeCell key={i} time={this.props.timeData[i]} />) // time
      for (let j = 0; j < this.props.venueData.length; j++) {
        if (this.props.venueData[j].eventsData.hasOwnProperty(rowLabel)) {
          children.push(<EventCell key={rowLabel+j} event={this.props.venueData[j].eventsData[rowLabel]} />) // event data
        }
        else {
          children.push(<EventCell key={rowLabel+j} event={null} />)
        }
      }
      rows.push(<TimeRow key={i} children={children} />)
    }

    return (
      <table width="100%">
        <thead>
          <tr><th/>{columns}</tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
}

class TimeRow extends React.Component {
  render() {
    return (
      <tr>{this.props.children}</tr>
    )
  }
}

class VenueCell extends React.Component {
  render() {
    const venue = this.props.venue;
    return (
      <th>{venue.venueName}</th>
    );
  }
}

class TimeCell extends React.Component {
  render() {
    const time = this.props.time;
    return (
      <td>{time.rowLabel}</td>
    );
  }
}

class EventCell extends React.Component {
  render() {
    const event = this.props.event;
    if (event) {
      return (
        <td>{event.eventName}</td>
      );
    }

    return (<td/>)
  }
}

export default App;
