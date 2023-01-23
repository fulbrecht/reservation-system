import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import SearchForm from "./searchForm";
import ReservationsList from "../reservations/reservationsList";
import ErrorAlert from "../layout/ErrorAlert";

function Search(){
    const [mobile_number, setMobileNumber] = useState("");
    const [reservations, setReservations] = useState([]);
    const [reservationsError, setReservationsError] = useState(null);

    useEffect(loadSearch, [mobile_number]);

    function loadSearch() {
        const abortController = new AbortController();

        setReservationsError(null);
        listReservations({ mobile_number }, abortController.signal)
        .then(setReservations)
        .catch(setReservationsError);
        
        return () => abortController.abort();
    }

    const list = reservations.length > 0 ?
        <ReservationsList reservations={reservations} /> :
        <h4>No reservations found</h4>

    return (
        <main>
            <h1>Search</h1>
            <SearchForm setMobileNumber={setMobileNumber} />
            <ErrorAlert error={reservationsError} />
            {list}
        </main>
    )
}

export default Search;