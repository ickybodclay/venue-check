import React, { useState } from "react";

export function AddVenuePopup(props) {
  const { closePopup, addClicked } = props;
  const [name, setName] = useState("");

  const handleNameChange = event => {
    setName(event.target.value);
  };

  const handleSubmit = _event => {
    addClicked({
      name: name
    });
  };

  return (
    <div className="popup">
      <div className="popup_inner">
        <h2>Add Venue</h2>
        <input
          className="venue-name-input"
          type="text"
          value={name}
          onChange={handleNameChange}
        />
        <br />
        <br />
        <button className="add" onClick={handleSubmit}>
          Add
        </button>
        <br />
        <br />
        <button className="remove" onClick={closePopup}>
          Cancel
        </button>
      </div>
    </div>
  );
}
