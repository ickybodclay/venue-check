import React, { Component } from 'react';
//import logo from './logo.svg';
import gcalEventsData from './events.json'
import './App.css';
//import ReactDOM from 'react-dom';

class App extends Component {
  constructor() {
    super();
    this.state = {
      venueData: {
        "Planet Ant Black Box" : {
          address: "2357 Caniff St, Hamtramck, MI 48212",
          eventsData: {
            "1am": {
              eventName: "Foo Test",
            }
          }
        },
        "Planet Ant Black Box (2nd Floor)" : {
          address: "2357 Caniff St, Hamtramck, MI 48212",
          eventsData: {
            "7pm": {
              eventName: "Bar Test",
            }
          }
        },
        "Ant Hall (Main Stage)" : {
          address: "2320 Caniff St, Hamtramck, MI 48212",
          eventsData: {}
        },
        "Ant Hall (Green Room)" : {
          address: "2320 Caniff St, Hamtramck, MI 48212",
          eventsData: {}
        },
        "Ant Hall (New Bros)" : {
          address: "2320 Caniff St, Hamtramck, MI 48212",
          eventsData: {}
        },
        "Ant Hall (Front Room)" : {
          address: "2320 Caniff St, Hamtramck, MI 48212",
          eventsData: {}
        },
        "Podcast Studio" : {
          address: "11831 Joseph Campau Ave, Hamtramck, MI 48212",
          eventsData: {
            "5pm": {
              eventName: "Pod Test",
            }
          }
        }
      },
      timeData: [
        "1am",
        "2am",
        "3am",
        "4am",
        "5am",
        "6am",
        "7am",
        "8am",
        "9am",
        "10am",
        "11am",
        "12am",
        "1pm",
        "2pm",
        "3pm",
        "4pm",
        "5pm",
        "6pm",
        "7pm",
        "8pm",
        "9pm",
        "10pm",
        "11pm",
        "12pm"
      ]
    }
  }

  componentDidMount() {
    getCalendarEvents().then(response => {
      //console.log(response)
      this.parseCalendarEventsResponse(response)
    });
  }

  parseCalendarEventsResponse(response) {
    // TODO clear old eventsData
    //this.state.venueData.eventsData = {}
    //this.setState({venueData})

    response.items.map(event => {
      console.log(event)
      if (event.location) {
        //const venue = event.location
        //const eventName = event.summary
        if (event.start && event.end) {
          //const startTime = event.start.dateTime
          //const endTime = event.end.dateTime
          //newEvent.eventName = eventName
        } 
      }     
      return 1
    });
  }

  render() {
    return (
      <div className="App">
        <VenueTable venueData={this.state.venueData} timeData={this.state.timeData} />
      </div>
    );
  }
}

async function getCalendarEvents() {
  return gcalEventsData
}

class VenueTable extends React.Component {
  render() {
    const venues = Object.keys(this.props.venueData)
    let columns = venues.map(venueName => {
      return <VenueCell key={venueName} venueName={venueName} />
    });
    console.log(columns)

    const rows = [];
    for (let i = 0; i < this.props.timeData.length; i++) {
      let children = []
      let rowLabel = this.props.timeData[i]
      children.push(<TimeCell key={i} time={this.props.timeData[i]} />) // time
      for (let j = 0; j < venues.length; j++) {
        if (this.props.venueData[venues[j]].eventsData.hasOwnProperty(rowLabel)) {
          children.push(<EventCell key={rowLabel + j} event={this.props.venueData[venues[j]].eventsData[rowLabel]} />) // event data
        }
        else {
          children.push(<EventCell key={rowLabel + j} event={null} />)
        }
      }
      rows.push(<TimeRow key={i} children={children} />)
    }

    return (
      <table width="100%">
        <thead>
          <tr><th />{columns}</tr>
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
    const venueName = this.props.venueName
    return (
      <th>{venueName}</th>
    );
  }
}

class TimeCell extends React.Component {
  render() {
    const time = this.props.time;
    return (
      <td>{time}</td>
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

    return (<td />)
  }
}

export default App;
