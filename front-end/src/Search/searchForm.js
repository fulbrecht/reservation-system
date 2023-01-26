import React, { useState } from "react";

function SearchForm({setMobileNumber}){
    
    const initialFormState = {
        mobile_number: "",
    }
    const [formData, setFormData] = useState({ ...initialFormState });
    
    const handleChange = ({ target }) => {

        const value = target.value;
        setFormData({
          ...formData,
          [target.name]: value,
        });
    };

    function searchHandler(event){
        event.preventDefault();
        const {mobile_number} = formData;
        setMobileNumber(mobile_number);

    }

    return (
        <form onSubmit={searchHandler}>
            <input type="search" 
                name="mobile_number" 
                placeholder="Enter a customer's phone number"
                onChange={handleChange}
                value={formData.mobile_data}
            />
            <button type="submit">Search</button>
        </form>
    )
}

export default SearchForm;