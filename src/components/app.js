import React, { useState, useEffect } from "react";

//libraries
import { GoogleLogin } from "react-google-login";
import { GoogleLogout } from "react-google-login";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { scaleRotate as Menu } from "react-burger-menu";

//components
import { VenueTable } from "./venueTable";
import { AddVenuePopup } from "./addVenuePopup";

//utility
import { getGoogleApiKey, getGoogleClientId } from "../utils/googleUtils";

const TIME_DATA = [
  { label: "12am", hour: 0 },
  { label: "1am", hour: 1 },
  { label: "2am", hour: 2 },
  { label: "3am", hour: 3 },
  { label: "4am", hour: 4 },
  { label: "5am", hour: 5 },
  { label: "6am", hour: 6 },
  { label: "7am", hour: 7 },
  { label: "8am", hour: 8 },
  { label: "9am", hour: 9 },
  { label: "10am", hour: 10 },
  { label: "11am", hour: 11 },
  { label: "12pm", hour: 12 },
  { label: "1pm", hour: 13 },
  { label: "2pm", hour: 14 },
  { label: "3pm", hour: 15 },
  { label: "4pm", hour: 16 },
  { label: "5pm", hour: 17 },
  { label: "6pm", hour: 18 },
  { label: "7pm", hour: 19 },
  { label: "8pm", hour: 20 },
  { label: "9pm", hour: 21 },
  { label: "10pm", hour: 22 },
  { label: "11pm", hour: 23 }
];

export function App() {
  const storageVenueData = JSON.parse(localStorage.getItem("venueData"));
  const initVenueData = storageVenueData ? storageVenueData : [];
  const [venueData, setVenueData] = useState(initVenueData);
  const [eventsData, setEventsData] = useState({});
  const [accessToken, setAccessToken] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPopup, setShowPopup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    localStorage.setItem("venueData", JSON.stringify(venueData));
  }, [venueData]);

  function handleDateChange(date) {
    console.log(`selected date changed ${selectedDate} >> ${date}`);

    setSelectedDate(date);

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
        fetchEvents(selectedDate, response.Zi.access_token);
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

  async function fetchEvents(date, token) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById("date-label").innerHTML = date.toLocaleDateString('en-US', options);
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

    const calendar = encodeURIComponent("primary");
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
      console.log(`error: ${error.status}`);
    }
  }

  function parseCalendarEventsResponse(response) {
    let eventsData = {};
    response.items.forEach(event => {
      if (event.location) {
        const location = event.location;
        const venue = event.location.split(",")[0];
        const eventName = event.summary;
        if (event.start && event.end) {
          if (!eventsData[venue]) {
            eventsData[venue] = [];
          }

          eventsData[venue].push({
            name: eventName,
            venue: venue,
            location: location,
            startTime: new Date(event.start.dateTime),
            endTime: new Date(event.end.dateTime)
          });
        }
      }
    });

    setEventsData(eventsData);
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
        </Menu>
        <main id="page-wrap">
          <h2 id="date-label"></h2>
          <VenueTable
            venueData={venueData}
            timeData={TIME_DATA}
            selectedDate={selectedDate}
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
