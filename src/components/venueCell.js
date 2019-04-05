import React, { Component } from "react";

export class VenueCell extends Component {
  render() {
    const venueIndex = this.props.venueIndex;
    return (
      <th>
        {this.props.venueName}&nbsp;
        {this.props.showDelete && (
          <button
            className="removeVenue"
            onClick={() => this.props.onDeleteClicked(venueIndex)}
          >
            X
          </button>
        )}
      </th>
    );
  }
}
