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


    //sort reservations by time
    const sortedReservations = reservations.sort((r1, r2) => 
        (r1.reservation_time > r2.reservation_time) ? 1 : (r1.reservation_time < r2.reservation_time) ? -1 : 0);

    //construct list of reservation components 
    const list = sortedReservations.map((reservation) => (
        <Reservation key={reservation.reservation_id} reservation={reservation} />
    ));

    return(
        <main className="container">
            <ErrorAlert error={reservationsError} />
            <table className="table">
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>Id</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Phone #</th>
                        <th>People</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {list}
                </tbody>
            </table>
        </main>
    )
}

export default ReservationsList;