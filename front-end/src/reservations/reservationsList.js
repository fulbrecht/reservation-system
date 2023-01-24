import React from "react";
import Reservation from "./reservation";

function ReservationsList({reservations, load}){

    //construct list of reservation components 
    const list = reservations.map((reservation) => (
        <Reservation key={reservation.reservation_id} reservation={reservation} load={load}/>
    ));

    return(
        <main className="container">
            <table className="table">
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>Status</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Phone #</th>
                        <th>People</th>
                        <th></th>
                        <th></th>
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