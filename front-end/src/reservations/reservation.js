import React from "react";

function Reservation({reservation}){
    return (
        <tr>
            <td>{reservation.reservation_time}</td>
            <td>{reservation.reservation_id}</td>
            <td>{reservation.first_name}</td>
            <td>{reservation.last_name}</td>
            <td>{reservation.mobile_number}</td>
            <td>{reservation.reservation_date}</td>
            <td><button>Seat</button></td>
        </tr>
    )
}

export default Reservation