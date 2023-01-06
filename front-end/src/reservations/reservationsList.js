import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import Reservation from "./reservation";
import ErrorAlert from "../layout/ErrorAlert";

function ReservationsList({date}){

    const [reservations, setReservations] = useState([]);
    const [reservationsError, setReservationsError] = useState(null);

    useEffect(loadReservations, [date]);

    function loadReservations() {
        const abortController = new AbortController();
        setReservationsError(null);
        listReservations({ date }, abortController.signal)
        .then(setReservations)
        .catch(setReservationsError);
        return () => abortController.abort();
    }

    const list = reservations.map((reservation) => (
        <Reservation key={reservation.reservation_id} reservation={reservation} />
    ));

    return(
        <main className="container">
            <ErrorAlert error={reservationsError} />
            <h2 className="font-poppins">Reservations</h2>
            <hr />
            <section className="row">{list}</section>
        </main>
    )
}

export default ReservationsList;