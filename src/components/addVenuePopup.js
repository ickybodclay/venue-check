import React, { Component } from "react";

export class AddVenuePopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      address: ""
    };
  }

  handleNameChange = event => {
    this.setState({ name: event.target.value });
  };

  handleSubmit = event => {
    console.log(this.state.name);
    this.props.addClicked({
      name: this.state.name
    });
  };

  render() {
    return (
      <div className="popup">
        <div className="popup_inner">
          <h2>Add Venue</h2>
          <input
            className="venue-name-input"
            type="text"
            value={this.state.name}
            onChange={this.handleNameChange}
          />
          <br />
          <br />
          <button className="add" onClick={this.handleSubmit}>
            Add
          </button>
          <br />
          <br />
          <button className="remove" onClick={this.props.closePopup}>
            Cancel
          </button>
        </div>
      </div>
    );
  }
}
