import React, { useState } from "react";

export function AddVenuePopup(props) {
  const { closePopup } = props;
  const [name, setName] = useState("");
  //const [address, setAddress] = useState("");

  const handleNameChange = event => {
    setName(event.target.value);
  };

  const handleSubmit = _event => {
    const { addClicked } = props;

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
