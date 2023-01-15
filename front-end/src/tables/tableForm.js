import ErrorAlert from "../layout/ErrorAlert";
import React, { useState } from "react";
import { useHistory } from "react-router";

function TableForm(){

    const initialFormState = {
        table_name: "",
        capacity: 0,
    }

    const history = useHistory();
    const [tableError, setTableError] = useState(null);
    const [formData, setFormData] = useState({ ...initialFormState });

    function handleSubmit(){
        setTableError(null)
    }

    const handleCancel = (event) => {
        event.preventDefault();
        history.goBack();
    }

    const handleChange = ({ target }) => {

        const value = target.name === "capacity" ? target.valueAsNumber : target.value;
        setFormData({
          ...formData,
          [target.name]: value,
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="table_name">
                Table Name:
                <input 
                id="table_name"
                type="text"
                name="table_name"
                minLength="2"
                onChange={handleChange}
                value={formData.table_name}
                required
                />
            </label>
            <br />
            <label htmlFor="capacity">
                Capacity:
                <input 
                id="capacity"
                type="number"
                name="capacity" 
                min="1"
                onChange={handleChange}
                value={formData.capacity}
                required
                />
            </label>
            <br />
            <ErrorAlert error={tableError} />
            <br />
            <button type="submit">Submit</button>
            <br />
            <button type="cancel" onClick={handleCancel}>Cancel</button>
        </form>
    )
}

export default TableForm;