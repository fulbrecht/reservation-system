import React from "react";

function Reservation({reservation}){
    const link = `/reservations/${reservation.reservation_id}/seat`;

    return (
        <tr>
            <td>{reservation.reservation_time}</td>
            <td>{reservation.reservation_id}</td>
            <td>{reservation.first_name}</td>
            <td>{reservation.last_name}</td>
            <td>{reservation.mobile_number}</td>
            <td>{reservation.reservation_date}</td>
            <td><button href={link}>Seat</button></td>
        </tr>
    )
}

export default Reservation