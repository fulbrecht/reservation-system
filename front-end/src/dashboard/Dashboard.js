import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { previous, next, today} from "../utils/date-time";
import { useHistory } from "react-router";
import ReservationsList from "../reservations/reservationsList";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({date}) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const previousDate = previous(date);
  const nextDate = next(date);
  const history = useHistory();

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }


  //navigate to next date
  const handleNext = () => {
    history.push(`/dashboard?date=${nextDate}`);
  }

  //navigate to current date
  const handleToday = () => {
    history.push(`/dashboard?date=${today()}`);
  }

  //navigate to previous date
  const handlePrevious = () => {
    history.push(`/dashboard?date=${previousDate}`);
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <button onClick={handlePrevious}>Previous</button>
      <button onClick={handleToday}>Today</button>
      <button onClick={handleNext}>Next</button>
      <ReservationsList date={date} reservations={reservations} />
    </main>
  );
}

export default Dashboard;
