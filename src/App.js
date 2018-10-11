import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import GoogleLogin from 'react-google-login';
//import logo from './logo.svg';
import './App.css';
import apiConfig from './api_config.json'
import oauthConfig from './client_secret.json'
import gcalEventsData from './events.json' // FOR TESTING ONLY - Google API Explorer saved response json

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
        "Planet Ant Studio" : {
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
        "12pm",
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
        "12am"
      ],
      eventsData: { }
    }
  }

  componentDidMount() {
    // requires OAuth
    /*
    const calendar  = encodeURIComponent("primary")
    const timeMin   = encodeURIComponent("2018-10-26T00:00:00-04:00")
    const timeMax   = encodeURIComponent("2018-10-26T23:00:00-04:00")
    const fields    = encodeURIComponent("items(end,location,start,summary)")
    const key       = encodeURIComponent(getGoogleApiKey())
    let eventListRequest = `https://www.googleapis.com/calendar/v3/calendars/${calendar}/events?timeMax=${timeMax}&timeMin=${timeMin}&fields=${fields}&key=${key}`
    console.log(eventListRequest)
    fetch(eventListRequest)
      .then(res => res.json())
      .then(
        (result) => {
          this.parseCalendarEventsResponse(result)
        },
        (error) => {
          // TODO handle error here
          console.log(error)
        }
      );
    //*/

    //*
    getCalendarEvents().then(response => {
      this.parseCalendarEventsResponse(response)
    });
    //*/
  }

  parseCalendarEventsResponse(response) {
    //console.log(response)
    let eventsData = {}
    response.items.forEach(event => {
      //console.log(event)
      if (event.location) {
        const venue = event.location.split(",")[0]
        const eventName = event.summary
        if (event.start && event.end) {
          const startTime = new Date(event.start.dateTime)
          const endTime = new Date(event.end.dateTime)
          let times = this.state.timeData.slice(startTime.getHours()-1, endTime.getHours()-1)

          if (!eventsData[venue]) {
            eventsData[venue] = []
          }

          eventsData[venue].push({name: eventName, times: times})
        }
      }   
    });

    this.setState({
      eventsData : eventsData
    })
  }

  render() {
    return (
      <div className="App">
        <VenueTable venueData={this.state.venueData} timeData={this.state.timeData} eventsData={this.state.eventsData} />
        <div id="Login">
          <br/>
          <GoogleLogin
            clientId={getGoogleClientId()}
            buttonText="Login"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
          />
        </div>
      </div>
    );
  }
}

async function getCalendarEvents() {
  return gcalEventsData
}

function getGoogleApiKey() {
  return apiConfig.key
}

function getGoogleClientId() {
  return oauthConfig.web.client_id
}

const responseGoogle = (response) => {
  console.log(response);
}

class VenueTable extends React.Component {
  render() {
    const venues = Object.keys(this.props.venueData)
    let columns = venues.map(venueName => {
      return <VenueCell key={venueName} venueName={venueName} />
    });

    const rows = []
    for (let i = 0; i < this.props.timeData.length; i++) { // row
      let children = []
      const time = this.props.timeData[i]
      children.push(<TimeCell key={i} time={this.props.timeData[i]} />)
      for (let j = 0; j < venues.length; j++) { // column
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
