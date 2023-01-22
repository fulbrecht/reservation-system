import React from "react";
import { useHistory } from "react-router";

function Reservation({reservation}){
    const link = `/reservations/${reservation.reservation_id}/seat`;
    const history = useHistory();

    const handleClick = () => {
        history.push(link);
      }

    return (
        <tr>
            <td>{reservation.reservation_time}</td>
            <td data-reservation-id-status={reservation.reservation_id}>{reservation.status}</td>
            <td>{reservation.first_name}</td>
            <td>{reservation.last_name}</td>
            <td>{reservation.mobile_number}</td>
            <td>{reservation.people}</td>
            <td>{reservation.status === "booked" && 
                <button href={link} onClick={handleClick}>Seat</button>
                }
            </td>
        </tr>
    )
}

export default Reservation