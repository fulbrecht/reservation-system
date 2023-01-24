import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import NewReservations from "../reservations/newReservations";
import useQuery from "../utils/useQuery";
import NewTables from "../tables/newTables";
import SeatReservation from "../reservations/seatReservation";
import Search from "../Search/search";
import EditReservation from "../reservations/editReservation";




/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  var date = today();
  const query = useQuery();

  if(query.get("date")){
    date = query.get("date");
  }

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations/new">
        <NewReservations />
      </Route>
      <Route exact={true} path="/reservations/:reservationId/seat">
        <SeatReservation />
      </Route>
      <Route exact={true} path="/reservations/:reservationId/edit">
        <EditReservation />
      </Route>
      <Route path="/dashboard">
        <Dashboard  date={date}/>
      </Route>
      <Route path="/tables/new">
        <NewTables />
      </Route>
      <Route path="/search">
        <Search />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
