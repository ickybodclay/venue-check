import React, { useState, useEffect } from "react";

//libraries
import { GoogleLogin } from "react-google-login";
import { GoogleLogout } from "react-google-login";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { slide as Menu } from "react-burger-menu";

//components
import { VenueTable } from "./venueTable";
import { AddVenuePopup } from "./addVenuePopup";

//utility
import { getGoogleApiKey, getGoogleClientId } from "../utils/googleUtils";

export function App() {
  const storageVenueData = JSON.parse(localStorage.getItem("venueData"));
  const initVenueData = storageVenueData ? storageVenueData : [];
  const [venueData, setVenueData] = useState(initVenueData);
  const [calendarsData, setCalendarsData] = useState([]);
  const [eventsData, setEventsData] = useState({});
  const [googleUser, setGoogleUser] = useState();
  const [tokenExpiration, setTokenExpiration] = useState(-1);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCalendar, setSelectedCalendar] = useState();
  const [showPopup, setShowPopup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    localStorage.setItem("venueData", JSON.stringify(venueData));
  }, [venueData]);

  function removeVenueClicked() {
    if (venueData.length > 0) {
      setShowDelete(!showDelete);
    }
  }

  function handleDateChange(date) {
    setSelectedDate(date);

    if (hasValidToken()) {
      fetchEvents(googleUser.tokenObj.access_token, date);
    }
    else {
      refreshLogin(date);
    }
  }

  function hasValidToken() {
    return googleUser && !isTokenExpired(new Date());
  }

  function isTokenExpired(date) {
    return date.getTime() > tokenExpiration;
  }

  async function refreshLogin(date) {
    if (googleUser) {
      try {
        const response = await googleUser.reloadAuthResponse();
        handleReloadAuthResponse(date, response);
      } catch (error) {
        console.log(`refreshLogin> error = ${error.status}`);
      }
    }
  }

  function handleReloadAuthResponse(date, response) {
    if (response && !response.error) {
      googleUser.tokenObj = response;
      setGoogleUser(googleUser);
      setTokenExpiration(response.expires_at);
      setIsLoggedIn(true);
      const token = response.access_token
      fetchCalendars(token);
      if (selectedCalendar)
        fetchEvents(token, date, selectedCalendar);
      else
        fetchEvents(token, date);
    }
    else {
      console.log(`handleReloadAuthResponse> error = ${response && response.error}`);
      setIsLoggedIn(false);
    }
  }

  function handleGoogleLoginResponse(response) {
    if (response && !response.error) {
      setGoogleUser(response);
      setTokenExpiration(response.tokenObj.expires_at);
      setIsLoggedIn(true);
      const token = response.tokenObj.access_token;
      fetchCalendars(token);
      fetchEvents(token, selectedDate);
    } else {
      console.log(`handleGoogleLoginResponse> error = ${response && response.error}`);
      setIsLoggedIn(false);
    }
  }

  function handleLogout() {
    setEventsData({});
    showLoginButton();
  }

  function showLoginButton() {
    setIsLoggedIn(false);
  }

  function showLogoutButton() {
    setIsLoggedIn(true);
  }

  function addVenue(venue) {
    let newVenueData = [...venueData];
    newVenueData.push(venue);
    setVenueData(newVenueData);
  }

  function removeVenue(index) {
    let newVenueData = [...venueData];
    newVenueData.splice(index, 1);
    setVenueData(newVenueData);
    setShowDelete(!showDelete);
  }

  function addVenuePopupSubmitted(venue) {
    addVenue(venue);
    togglePopup();
  }

  function togglePopup() {
    setShowPopup(!showPopup);
  }

  async function fetchEvents(token, date, cal="primary") {
    setEventsData({});
    const start = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      0,
      0,
      0,
      0
    );
    const end = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + 1,
      0,
      0,
      0,
      0
    );

    const calendar = encodeURIComponent(cal);
    const timeMin = encodeURIComponent(start.toISOString());
    const timeMax = encodeURIComponent(end.toISOString());
    const fields = encodeURIComponent("items(end,location,start,summary)");
    const key = encodeURIComponent(getGoogleApiKey());
    const eventListRequest = `https://www.googleapis.com/calendar/v3/calendars/${calendar}/events?timeMax=${timeMax}&timeMin=${timeMin}&fields=${fields}&key=${key}`;

    try {
      const response = await fetch(eventListRequest, {
        method: "GET",
        headers: new Headers({ Authorization: "Bearer " + token })
      });
      const result = await response.json();
      parseCalendarEventsResponse(result);
      showLogoutButton();
    } catch (error) {
      console.log(`fetchEvents> error = ${error.status}`);
    }
  }

  function parseCalendarEventsResponse(response) {
    let eventsData = {};
    response.items.forEach(event => {
      if (event.location) {
        const location = event.location;
        const venue = venueData.find(v => location.includes(v.name));
        if (venue) {
          const eventName = event.summary;
          if (event.start && event.end) {
            if (!eventsData[venue.name]) {
              eventsData[venue.name] = [];
            }

            eventsData[venue.name].push({
              title: eventName,
              venue: venue.name,
              location: location,
              start: event.start.dateTime || event.start.date,
              end: event.end.dateTime || event.end.date
            });
          }
        }
      }
    });

    setEventsData(eventsData);
  }

  async function fetchCalendars(token) {
    setCalendarsData([]);
    const calendarListRequest = `https://www.googleapis.com/calendar/v3/users/me/calendarList`;
    try {
      const response = await fetch(calendarListRequest, {
        method: "GET",
        headers: new Headers({ Authorization: "Bearer " + token })
      });
      const result = await response.json();
      parseListCalendarsResponse(result);
    } catch (error) {
      console.log(`fetchCalendars> error = ${error.status}`);
    }
  }

  function parseListCalendarsResponse(response) {
    let calendarsData = [];
    calendarsData = response.items.map(calendar => {
      return {
        id: calendar.id,
        name: calendar.summary
      };
    });
    setCalendarsData(calendarsData);
  }

  function getCalendarOptions() {
    let optionItems = calendarsData.map((calendar) =>
        <option key={calendar.id} id={calendar.id}>{calendar.name}</option>
    );
    return optionItems;
  }

  function onCalendarChange(event) {
    const name = event.target.value;
    let cal = {};
    cal = calendarsData.find(calendar => calendar.name == name)
    setSelectedCalendar(cal);
    fetchEvents(token, selectedDate, selectedCalendar);
  }

  return (
    <div className="App">
      <div id="outer-container">
        <Menu
          pageWrapId={"page-wrap"}
          outerContainerId={"outer-container"}
          disableAutoFocus
          noOverlay
        >
          <h1>Venue Check</h1>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            className="date-picker"
            peekNextMonth
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
          />
          <br />
          <br />
          <select onChange={onCalendarChange}>
            {getCalendarOptions()}
          </select>
          <br />
          <br />
          <button className="add" onClick={togglePopup}>
            <span role="img" aria-label="plus">
              ➕
            </span>
            Add Venue
          </button>
          <br />
          <button className="remove" onClick={removeVenueClicked}>
            <span role="img" aria-label="trashcan">
              🗑️{" "}
            </span>{" "}
            Remove Venue
          </button>
          <br />
          {!isLoggedIn && (
            <div id="googleLoginButton">
              <GoogleLogin
                theme="dark"
                clientId={getGoogleClientId()}
                buttonText="Login"
                scope="profile email https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events.readonly"
                onSuccess={handleGoogleLoginResponse}
                onFailure={handleGoogleLoginResponse}
                isSignedIn={process.env.REACT_APP_KMSI === "true"}
              />
            </div>
          )}
          {isLoggedIn && (
            <div id="googleLogoutButton">
              <GoogleLogout
                theme="dark"
                buttonText="Logout"
                onLogoutSuccess={handleLogout}
              />
            </div>
          )}
        </Menu>
        <main id="page-wrap">
          <VenueTable
            venueData={venueData}
            selectedDate={selectedDate}
            selectedCalendar={selectedCalendar}
            eventsData={eventsData}
            handleRemoveVenue={removeVenue}
            showDelete={showDelete}
          />
          {showPopup ? (
            <AddVenuePopup
              addClicked={addVenuePopupSubmitted}
              closePopup={togglePopup}
            />
          ) : null}
        </main>
      </div>
    </div>
  );
}
