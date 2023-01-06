import React from "react";
import ReservationForm from "./reservationForm";
import ReservationsTest from "./reservationsTest";

function NewReservations(){
    return (
        <div>
            <h1>New Reservations</h1>
            <ReservationForm />
            <ReservationsTest />
        </div>
    )
}

export default NewReservations