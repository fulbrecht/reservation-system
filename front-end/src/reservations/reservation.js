import React from "react";

function Reservation({reservation}){
    return (
        <div>
            <p>{reservation.reservation_id}</p>
            <br />
            <p>{reservation.first_name}</p>
            <br />
            <p>{reservation.last_name}</p>
            <br />
            <p>{reservation.mobile_number}</p>
            <br />
            <p>{reservation.reservation_date}</p>
            <br />
        </div>
    )
}

export default Reservation