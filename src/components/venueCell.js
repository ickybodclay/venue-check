import React from "react";

export function VenueCell(props) {
  const { venueIndex, onDeleteClicked, venueName, showDelete } = props;
  return (
    <th>
      {venueName}&nbsp;
      {showDelete && (
        <button
          className="removeVenue"
          onClick={() => onDeleteClicked(venueIndex)}
        >
          X
        </button>
      )}
    </th>
  );
}
