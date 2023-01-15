import ErrorAlert from "../layout/ErrorAlert";
import React, { useState } from "react";
import { useHistory } from "react-router";
import { createReservation } from "../utils/api";

function ReservationForm(){
  const initialFormState = {
      first_name: "",
      last_name: "",
      mobile_number: "",
      reservation_date: "",
      reservation_time: "",
      people: 0,
    };

  const history = useHistory();
  const [reservationsError, setReservationsError] = useState(null);
  const [formData, setFormData] = useState({ ...initialFormState });

  const handleChange = ({ target }) => {

    const value = target.name === "people" ? target.valueAsNumber : target.value;
    setFormData({
      ...formData,
      [target.name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Submitted:", formData);
    const reservation = {
      ...formData
    }

    setReservationsError(null);

    const response = await createReservation(reservation);
    const savedData = await response.json();
    setReservationsError(Error(savedData.error));
    console.log("Saved reservation!", savedData);
    if(!savedData.error){
      history.push(`/dashboard?date=${reservation.reservation_date}`);
    }
    //setFormData({ ...initialFormState });

  };

  const handleCancel = (event) => {
    event.preventDefault();
    history.goBack();

  }

  return (
    <form onSubmit={handleSubmit}>
        <label htmlFor="first_name">
            First name:
            <input
            id="first_name"
            type="text"
            name="first_name"
            onChange={handleChange}
            value={formData.first_name}
            />
        </label>
        <br />
        <label htmlFor="last_name">
            Last name:
            <input
            id="last_name"
            type="text"
            name="last_name"
            onChange={handleChange}
            value={formData.last_name}
            />
        </label>
        <br />
        <label htmlFor="mobile_number">
            Mobile number:
            <input
            id="mobile_number"
            type="tel"
            name="mobile_number"
            onChange={handleChange}
            value={formData.mobile_number}
            />
        </label>
        <br />
        <label htmlFor="reservation_date">
            Reservation date:
            <input
            id="reservation_date"
            type="date"
            name="reservation_date"
            onChange={handleChange}
            value={formData.reservation_date}
            />
        </label>
        <br />
        <label htmlFor="reservation_time">
            Reservation time:
            <input
            id="reservation_time"
            type="time"
            name="reservation_time"
            onChange={handleChange}
            value={formData.reservation_time}
            />
        </label>
        <br />
        <label htmlFor="people">
            Number of people:
            <input
            id="people"
            type="number"
            name="people"
            onChange={handleChange}
            value={formData.people}
            />
        </label>
        <br />
        <ErrorAlert error={reservationsError} />
        <br />
        <button type="submit">Submit</button>
        <br />
        <button type="cancel" onClick={handleCancel}>Cancel</button>
    </form>
  );
}

export default ReservationForm;