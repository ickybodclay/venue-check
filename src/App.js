import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
//import ReactDOM from 'react-dom';

class App extends Component {
  constructor() {
    super();
    this.state = {
      eventData: [
        {
          id: 0,
          eventStartTime: "00:00",
          eventEndTime: "01:00",
          eventName: "Test",
          venueId: 0
        }
      ],
      venueData: [
        {
          id: 0,
          venueName: "Planet Ant Black Box",
          venueAddress: "2357 Caniff St, Hamtramck, MI 48212"
        },
        {
          id: 1,
          venueName: "Planet Ant Black Box (2nd Floor)",
          venueAddress: "2357 Caniff St, Hamtramck, MI 48212"
        },
        {
          id: 2,
          venueName: "Ant Hall (Main Stage)",
          venueAddress: "2320 Caniff St, Hamtramck, MI 48212"
        },
        {
          id: 3,
          venueName: "Ant Hall (Green Room)",
          venueAddress: "2320 Caniff St, Hamtramck, MI 48212"
        },
        {
          id: 4,
          venueName: "Ant Hall (New Bros)",
          venueAddress: "2320 Caniff St, Hamtramck, MI 48212"
        },
        {
          id: 5,
          venueName: "Ant Hall (Front Room)",
          venueAddress: "2320 Caniff St, Hamtramck, MI 48212"
        },
        {
          id: 6,
          venueName: "Podcast Studio",
          venueAddress: "11831 Joseph Campau Ave, Hamtramck, MI 48212"
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

  createTable = () => {
    let table = []

    let columns = this.state.venueData.map(venueData => {
      return (<th> { venueData.venueName } </th>)
    })

    table.push(<tr><th/>{columns}</tr>) // extra th to leave space for times

    for (let i = 0; i < this.state.timeData.length; i++) {
      let children = []
      children.push(<td>{this.state.timeData[i].rowLabel}</td>) // time
      for (let j = 0; j < this.state.venueData.length; j++) {
        children.push(<td>{i}</td>) // event data
      }
      table.push(<tr>{children}</tr>)
    }
    return table
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Venue Check</h1>
        </header>

        <table width="100%">
          { this.createTable() }
        </table>
      </div>
    );
  }
}

export default App;
