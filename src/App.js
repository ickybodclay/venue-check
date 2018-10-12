import React, { Component } from 'react';
import { GoogleLogin } from 'react-google-login';
import { GoogleLogout } from 'react-google-login';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      venueData: [
        {
          name: "Planet Ant Black Box",
          address: "2357 Caniff St, Hamtramck, MI 48212"
        },
        {
          name: "Planet Ant Black Box (2nd Floor)",
          address: "2357 Caniff St, Hamtramck, MI 48212"
        },
        {
          name: "Ant Hall (Main Stage)",
          address: "2320 Caniff St, Hamtramck, MI 48212"
        },
        {
          name: "Ant Hall (Green Room)",
          address: "2320 Caniff St, Hamtramck, MI 48212"
        },
        {
          name: "Ant Hall (New Bros)",
          address: "2320 Caniff St, Hamtramck, MI 48212"
        },
        {
          name: "Ant Hall (Front Room)",
          address: "2320 Caniff St, Hamtramck, MI 48212"
        },
        {
          name: "Ghost Light",
          address: "2314 Caniff St, Hamtramck, MI 48212, USA"
        },
        {
          name: "Planet Ant Studio",
          address: "11831 Joseph Campau Ave, Hamtramck, MI 48212"
        }
      ],
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
      eventsData: { },
      accessToken: "",
      currentDate: moment(),
      showPopup: false
    };
  }

  componentDidMount() {
    this.showLoginButton();
  }

  showLoginButton() {
    document.getElementById('googleLoginButton').hidden = false;
    document.getElementById('googleLogoutButton').hidden = true;
  }

  showLogoutButton() {
    document.getElementById('googleLoginButton').hidden = true;
    document.getElementById('googleLogoutButton').hidden = false;
  }

  addVenue(venue) {
    let venueData = [...this.state.venueData];
    venueData.push(venue)
    this.setState({
      venueData: venueData
    });
  }

  removeVenue(index) {
    let venueData = [...this.state.venueData];
    venueData.splice(index, 1);
    this.setState({
      venueData: venueData
    });
  }

  parseCalendarEventsResponse(response) {
    let eventsData = {};
    response.items.forEach(event => {
      if (event.location) {
        const venue = event.location.split(",")[0];
        const eventName = event.summary;
        if (event.start && event.end) {
          const startTime = new Date(event.start.dateTime);
          const endTime = new Date(event.end.dateTime);
          let times = this.state.timeData.slice(startTime.getHours()-1, endTime.getHours()-1);

          if (!eventsData[venue]) {
            eventsData[venue] = [];
          }

          eventsData[venue].push({name: eventName, times: times});
        }
      }   
    });

    this.setState({
      eventsData : eventsData
    });
  }

  fetchEvents(date) {
    this.setState({
      eventsData : {}
    });

    const start = new Date(date.year(), date.month(), date.date(), 0, 0, 0, 0);
    const end = new Date(date.year(), date.month(), date.date() + 1, 0, 0, 0, 0);

    const token     = this.state.accessToken;
    const calendar  = encodeURIComponent("primary");
    const timeMin   = encodeURIComponent(start.toISOString());
    const timeMax   = encodeURIComponent(end.toISOString());
    const fields    = encodeURIComponent("items(end,location,start,summary)");
    const key       = encodeURIComponent(getGoogleApiKey());
    let eventListRequest = `https://www.googleapis.com/calendar/v3/calendars/${calendar}/events?timeMax=${timeMax}&timeMin=${timeMin}&fields=${fields}&key=${key}`;
    fetch(eventListRequest, {method:'get', headers: new Headers({'Authorization' : 'Bearer ' + token})})
      .then(res => res.json())
      .then(
        (result) => {
          this.parseCalendarEventsResponse(result)
          this.showLogoutButton()
        },
        (error) => {
          console.log(error)
        }
      );
  }

  handleDateChange = (date) => {
    this.setState({
      currentDate: date
    });

    if (this.state.accessToken !== "") {
      this.fetchEvents(date);
    }
  }

  responseGoogle = (response) => {
    this.setState({
      accessToken: response.Zi.access_token
    })
    this.fetchEvents(this.state.currentDate);
  }

  logout = () => {
    this.setState({
      eventsData : {}
    });

    this.showLoginButton();
  }

  addVenueClicked = () => {
    this.togglePopup();
  }

  removeVenueClicked = () => {
    if (this.state.venueData.length > 0) {
      this.removeVenue(this.state.venueData.length - 1);
    }
  }

  addVenuePopupSubmitted(venue) {
    console.log(venue)
    this.addVenue(venue);
    this.togglePopup();
  }

  togglePopup() {
    this.setState({
      showPopup: !this.state.showPopup
    });
  }

  render() {
    return (
      <div className="App">
        <div id="container">
          <div id="left">
            <h1>Venue Check</h1>
          </div>
          <div id="middle">
            <table width="100%">
              <tbody>
                <tr>
                  <td>
                    <button className="add" onClick={this.addVenueClicked}>
                      <span role="img" aria-label="plus">➕</span>Add Venue
                    </button>
                  </td>
                  <td>
                    <DatePicker
                      selected={this.state.currentDate}
                      onChange={this.handleDateChange}
                      className="date-picker"
                      peekNextMonth
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                    />
                  </td>
                  <td>
                    <button className="remove" onClick={this.removeVenueClicked}>
                      <span role="img" aria-label="trashcan">🗑️ </span> Remove Venue
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            
          </div>
          <div id="right">
            <br/>
            <div id="googleLoginButton">
              <GoogleLogin
                clientId={getGoogleClientId()}
                buttonText="Login"
                scope="profile email https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events.readonly"
                onSuccess={this.responseGoogle}
                onFailure={this.responseGoogle}
              />
            </div>
            <div id="googleLogoutButton">
              <GoogleLogout
                buttonText="Logout"
                onLogoutSuccess={this.logout}
              />
            </div>
          </div>
        </div>
        <br/>
        <VenueTable venueData={this.state.venueData} timeData={this.state.timeData} eventsData={this.state.eventsData} />
        {
          this.state.showPopup ? 
          <Popup
            addClicked={this.addVenuePopupSubmitted.bind(this)}
            closePopup={this.togglePopup.bind(this)}
          />
          : null
        }
      </div>
    );
  }
}

function getGoogleApiKey() {
  return process.env.REACT_APP_GOOGLE_API_KEY;
}

function getGoogleClientId() {
  return process.env.REACT_APP_GOOGLE_CLIENT_ID;
}

class VenueTable extends React.Component {
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
        <td className="busy-cell">{event.name}</td>
      );
    }

    return (<td className="event" />)
  }
}

class Popup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      address: ""
    };
  }

  handleNameChange = (event) => {
    this.setState({name: event.target.value});
  }

  handleSubmit = (event) => {
    console.log(this.state.name);
    this.props.addClicked({
      name: this.state.name
    });
  }

  render() {
    return (
      <div className='popup'>
        <div className='popup_inner'>
          <h1>Add Venue</h1>
          <input className="venue-name-input" type="text" value={this.state.name} onChange={this.handleNameChange} />
          <br/><br/>
          <button className="add" onClick={this.handleSubmit}>Add</button>
          <br/><br/>
          <button className="remove" onClick={this.props.closePopup}>Cancel</button>
        </div>
      </div>
    );
  }
}

export default App;
