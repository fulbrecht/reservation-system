import ErrorAlert from "../layout/ErrorAlert";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { seatReservation } from "../utils/api";
import { listTables } from "../utils/api";

function SeatReservationForm({reservation_id}){

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

    const tableOptions = tables.map((table) => {
        return <option key={table.table_id} value={table.table_id}>{table.table_name} - {table.capacity}</option>
    })

  const initialFormState = {
      table_id: "",
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
    const tableId = formData.table_id;
    console.log("Submitted:", {reservation_id}, "Table ID:", tableId);

    setSeatError(null);

    const response = await seatReservation(tableId, {reservation_id});
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
        <ErrorAlert error={tableError} />
        <label>Select Table: 
            <select 
              id="table_id"
              name="table_id"
              onChange={handleChange}
              value={formData.table_id}
            >
              <option value="" >-- Select a Table --</option>
              {tableOptions}
            </select>
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