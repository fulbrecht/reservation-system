import ErrorAlert from "../layout/ErrorAlert";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { seatReservation } from "../utils/api";
import { listTables } from "../utils/api";

function SeatReservationForm({reservationId}){

    const [tables, setTables] = useState([]);
    const [tableError, setTableError] = useState(null);

    useEffect(loadTables, []);

    function loadTables() {
        const abortController = new AbortController();
        setTableError(null);
        listTables({status: "free"}, abortController.signal)
        .then(setTables)
        .catch(setTableError);
        return () => abortController.abort();
    }


  const initialFormState = {
      first_name: "",
      last_name: "",
    };

  const history = useHistory();
  const [seatError, setSeatError] = useState(null);
  const [formData, setFormData] = useState({ ...initialFormState });

  const handleChange = ({ target }) => {
    const value = target.value;
    setFormData({
      ...formData,
      [target.name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Submitted:", formData);
    const table = {
      ...formData
    }

    setSeatError(null);

    const response = await seatReservation(reservationId,table);
    const savedData = await response.json();
    setSeatError(Error(savedData.error));
    console.log("Reservation Seated!", savedData);
    if(!savedData.error){
      history.push(`/dashboard`);
    }

  };

  const handleCancel = (event) => {
    event.preventDefault();
    history.goBack();

  }

  return (
    <form onSubmit={handleSubmit}>
        <label>
            <select name="table_id" />
        </label>
        <br />
        <ErrorAlert error={seatError} />
        <br />
        <button type="submit">Submit</button>
        <br />
        <button type="cancel" onClick={handleCancel}>Cancel</button>
    </form>
  );
}

export default SeatReservationForm;