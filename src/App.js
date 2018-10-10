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
          address: "2357 Caniff St, Hamtramck, MI 48212"
        },
        "Planet Ant Black Box (2nd Floor)" : {
          address: "2357 Caniff St, Hamtramck, MI 48212"
        },
        "Ant Hall (Main Stage)" : {
          address: "2320 Caniff St, Hamtramck, MI 48212",
        },
        "Ant Hall (Green Room)" : {
          address: "2320 Caniff St, Hamtramck, MI 48212",
        },
        "Ant Hall (New Bros)" : {
          address: "2320 Caniff St, Hamtramck, MI 48212",
        },
        "Ant Hall (Front Room)" : {
          address: "2320 Caniff St, Hamtramck, MI 48212",
        },
        "Podcast Studio" : {
          address: "11831 Joseph Campau Ave, Hamtramck, MI 48212",
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
      ],
      eventsData: {
        "Planet Ant Black Box" : [
          {
            name: "Foo Test",
            times: ["1am","2am","3am"]
          },
          {
            name: "Bar Test",
            times: ["7pm","8pm","9pm"]
          }
        ]
      }
    }
  }

  componentDidMount() {
    getCalendarEvents().then(response => {
      //console.log(response)
      this.parseCalendarEventsResponse(response)
    });
  }

  parseCalendarEventsResponse(response) {
    // this.setState({
    //   eventsData : {}
    // });

    response.items.forEach(event => {
      console.log(event)
      if (event.location) {
        //const venue = event.location
        //const eventName = event.summary
        if (event.start && event.end) {
          // TODO figure out times for given range
          //const startTime = event.start.dateTime
          //const endTime = event.end.dateTime
          //newEvent.eventName = eventName
        } 
      }   
    });
  }

  render() {
    return (
      <div className="App">
        <VenueTable venueData={this.state.venueData} timeData={this.state.timeData} eventsData={this.state.eventsData} />
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

    const rows = []
    for (let i = 0; i < this.props.timeData.length; i++) {
      let children = []
      const time = this.props.timeData[i]
      children.push(<TimeCell key={i} time={this.props.timeData[i]} />)
      for (let j = 0; j < venues.length; j++) {
        const venue = venues[j]
        if (this.props.eventsData.hasOwnProperty(venue)) {
          let timeFound = false
          this.props.eventsData[venue].forEach(event => {
            if(event.times.includes(time)) {
              children.push(<EventCell key={time + j} event={event} />)
              timeFound = true
              return;
            }
          });

          if (!timeFound) {
            children.push(<EventCell key={time + j} event={null} />)
          }
        }
        else {
          children.push(<EventCell key={time + j} event={null} />)
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
    const time = this.props.time
    return (
      <td>{time}</td>
    );
  }
}

class EventCell extends React.Component {
  render() {
    const event = this.props.event
    if (event) {
      return (
        <td>{event.name}</td>
      );
    }

    return (<td />)
  }
}

export default App;
