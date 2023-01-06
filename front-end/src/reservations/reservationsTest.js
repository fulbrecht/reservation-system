import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import Reservation from "./reservation";

function ReservationsTest(){
    const [reservations, setReservations] = useState([])
    const [error, setError] = useState(null);

    useEffect(() => {
        setError(null);
        const abortController = new AbortController();
        listReservations({},abortController.signal).then(setReservations).catch(setError);
        return () => abortController.abort();
    }, []);

    const list = reservations.map((reservation) => (
        <Reservation key={reservation.reservarion_id} reservation={reservation} />
    ));

    console.log(list);

    return (
        <main className="container">
          <p>{error}</p>
          <h2 className="font-poppins">Test</h2>
          <hr />
          <section className="row">{list}</section>
        </main>
      );
}

export default ReservationsTest;