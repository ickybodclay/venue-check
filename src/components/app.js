import React, { Component } from "react";

//libraries
import { GoogleLogin } from "react-google-login";
import { GoogleLogout } from "react-google-login";
//import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";

//components
import { VenueTable } from "./venueTable";
import { AddVenuePopup } from "./addVenuePopup";

//Utility
import { getGoogleApiKey, getGoogleClientId } from "../utils/googleUtils";

export class App extends Component {
  constructor() {
    super();
    this.state = {
      venueData: [],
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
      eventsData: {},
      accessToken: "",
      currentDate: moment(),
      showPopup: false,
      removeBtnBgColor: "red"
    };
    this.venueTable = React.createRef();
  }

  componentDidMount() {
    this.hydrateStateWithLocalStorage();
    this.showLoginButton();

    window.addEventListener(
      "beforeunload",
      this.saveStateToLocalStorage.bind(this)
    );
  }

  componentWillUnmount() {
    window.removeEventListener(
      "beforeunload",
      this.saveStateToLocalStorage.bind(this)
    );

    this.saveStateToLocalStorage();
  }

  saveStateToLocalStorage() {
    localStorage.setItem("venueData", JSON.stringify(this.state.venueData));
  }

  hydrateStateWithLocalStorage() {
    if (localStorage.hasOwnProperty("venueData")) {
      const venueData = JSON.parse(localStorage.getItem("venueData"));
      this.setState({ venueData: venueData });
    }
  }

  showLoginButton() {
    document.getElementById("googleLoginButton").hidden = false;
    document.getElementById("googleLogoutButton").hidden = true;
  }

  showLogoutButton() {
    document.getElementById("googleLoginButton").hidden = true;
    document.getElementById("googleLogoutButton").hidden = false;
  }

  addVenue(venue) {
    let venueData = [...this.state.venueData];
    venueData.push(venue);
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

  fetchEvents(date) {
    this.setState({
      eventsData: {}
    });

    const start = new Date(date.year(), date.month(), date.date(), 0, 0, 0, 0);
    const end = new Date(
      date.year(),
      date.month(),
      date.date() + 1,
      0,
      0,
      0,
      0
    );

    const token = this.state.accessToken;
    const calendar = encodeURIComponent("primary");
    const timeMin = encodeURIComponent(start.toISOString());
    const timeMax = encodeURIComponent(end.toISOString());
    const fields = encodeURIComponent("items(end,location,start,summary)");
    const key = encodeURIComponent(getGoogleApiKey());
    let eventListRequest = `https://www.googleapis.com/calendar/v3/calendars/${calendar}/events?timeMax=${timeMax}&timeMin=${timeMin}&fields=${fields}&key=${key}`;
    fetch(eventListRequest, {
      method: "get",
      headers: new Headers({ Authorization: "Bearer " + token })
    })
      .then(res => res.json())
      .then(
        result => {
          this.parseCalendarEventsResponse(result);
          this.showLogoutButton();
        },
        error => {
          console.log(error);
        }
      );
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
          let times = this.state.timeData.slice(
            startTime.getHours() - 1,
            endTime.getHours() - 1
          );

          if (!eventsData[venue]) {
            eventsData[venue] = [];
          }

          eventsData[venue].push({ name: eventName, times: times });
        }
      }
    });

    this.setState({
      eventsData: eventsData
    });
  }

  handleDateChange = date => {
    this.setState({
      currentDate: date
    });

    if (this.state.accessToken !== "") {
      this.fetchEvents(date);
    }
  };

  handleGoogleLoginResponse = response => {
    this.setState({
      accessToken: response.Zi.access_token
    });
    this.fetchEvents(this.state.currentDate);
  };

  handleLogout = () => {
    this.setState({
      eventsData: {}
    });

    this.showLoginButton();
  };

  addVenueClicked = () => {
    this.togglePopup();
  };

  removeVenueClicked = () => {
    if (this.state.venueData.length > 0) {
      this.venueTable.current.toggleVenueDelete();
      if (this.state.removeBtnBgColor === "darkgray") {
        this.setState({ removeBtnBgColor: "red" });
      } else {
        this.setState({ removeBtnBgColor: "darkgray" });
      }
    }
  };

  addVenuePopupSubmitted(venue) {
    console.log(venue);
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
                      <span role="img" aria-label="plus">
                        ➕
                      </span>
                      Add Venue
                    </button>
                  </td>
                  <td>
                    {/* <DatePicker
                        selected={this.state.currentDate}
                        onChange={this.handleDateChange}
                        className="date-picker"
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                      /> */}
                  </td>
                  <td>
                    <button
                      className="remove"
                      style={{ backgroundColor: this.state.removeBtnBgColor }}
                      onClick={this.removeVenueClicked}
                    >
                      <span role="img" aria-label="trashcan">
                        🗑️{" "}
                      </span>{" "}
                      Remove Venue
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div id="right">
            <br />
            <div id="googleLoginButton">
              <GoogleLogin
                clientId={getGoogleClientId()}
                buttonText="Login"
                scope="profile email https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events.readonly"
                onSuccess={this.handleGoogleLoginResponse}
                onFailure={this.handleGoogleLoginResponse}
                isSignedIn={process.env.REACT_APP_KMSI === "true"}
              />
            </div>
            <div id="googleLogoutButton">
              <GoogleLogout
                buttonText="Logout"
                onLogoutSuccess={this.handleLogout}
              />
            </div>
          </div>
        </div>
        <br />
        <VenueTable
          ref={this.venueTable}
          venueData={this.state.venueData}
          timeData={this.state.timeData}
          eventsData={this.state.eventsData}
          handleRemoveVenue={this.removeVenue.bind(this)}
        />
        {this.state.showPopup ? (
          <AddVenuePopup
            addClicked={this.addVenuePopupSubmitted.bind(this)}
            closePopup={this.togglePopup.bind(this)}
          />
        ) : null}
      </div>
    );
  }
}
