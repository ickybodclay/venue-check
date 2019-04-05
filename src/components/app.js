import React, { useState, useEffect } from "react";

//libraries
import { GoogleLogin } from "react-google-login";
import { GoogleLogout } from "react-google-login";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

//components
import { VenueTable } from "./venueTable";
import { AddVenuePopup } from "./addVenuePopup";

//utility
import { getGoogleApiKey, getGoogleClientId } from "../utils/googleUtils";

const TIME_DATA = [
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
];

export function App() {
  const storageVenueData = JSON.parse(localStorage.getItem("venueData"));
  const initVenueData = storageVenueData ? storageVenueData : [];
  const [venueData, setVenueData] = useState(initVenueData);
  const [eventsData, setEventsData] = useState({});
  const [accessToken, setAccessToken] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showPopup, setShowPopup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    localStorage.setItem("venueData", JSON.stringify(venueData));
  }, [venueData]);

  function handleDateChange(date) {
    setCurrentDate(date);

    if (accessToken !== "") {
      fetchEvents(date, accessToken);
    }
  }

  function removeVenueClicked() {
    if (venueData.length > 0) {
      setShowDelete(!showDelete);
    }
  }

  function handleGoogleLoginResponse(response) {
    if (response) {
      if (!response.error) {
        setAccessToken(response.Zi.access_token);
        setIsLoggedIn(true);
        fetchEvents(currentDate, response.Zi.access_token);
      } else {
        setIsLoggedIn(false);
      }
    } else {
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
    let venueData = [...venueData];
    venueData.splice(index, 1);
    setVenueData(venueData);
  }

  function addVenuePopupSubmitted(venue) {
    //{name: name}
    addVenue(venue);
    togglePopup();
  }

  function togglePopup() {
    setShowPopup(!showPopup);
  }

  function fetchEvents(date, token) {
    setEventsData({});
    const start = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDay(),
      0,
      0,
      0,
      0
    );
    const end = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDay() + 1,
      0,
      0,
      0,
      0
    );

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
          parseCalendarEventsResponse(result);
          showLogoutButton();
        },
        error => {
          console.log(error);
        }
      );
  }

  function parseCalendarEventsResponse(response) {
    let eventsData = {};
    response.items.forEach(event => {
      if (event.location) {
        const venue = event.location.split(",")[0];
        const eventName = event.summary;
        if (event.start && event.end) {
          const startTime = new Date(event.start.dateTime);
          const endTime = new Date(event.end.dateTime);
          let times = TIME_DATA.slice(
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

    setEventsData(eventsData);
  }

  return (
    <div className="App">
      <div className="container">
        <div id="left">
          <h1>Venue Check</h1>
        </div>
        <div id="middle">
          <table width="100%">
            <tbody>
              <tr>
                <td>
                  <button className="add" onClick={togglePopup}>
                    <span role="img" aria-label="plus">
                      ➕
                    </span>
                    Add Venue
                  </button>
                </td>
                <td>
                  <DatePicker
                    selected={currentDate}
                    onChange={handleDateChange}
                    className="date-picker"
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                  />
                </td>
                <td>
                  <button className="remove" onClick={removeVenueClicked}>
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
          {!isLoggedIn && (
            <div id="googleLoginButton">
              <GoogleLogin
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
                buttonText="Logout"
                onLogoutSuccess={handleLogout}
              />
            </div>
          )}
        </div>
      </div>
      <br />
      <VenueTable
        venueData={venueData}
        timeData={TIME_DATA}
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
    </div>
  );
}
