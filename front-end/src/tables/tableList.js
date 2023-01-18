import React, { useEffect, useState } from "react";
import { listTables } from "../utils/api";
import Table from "./table";
import ErrorAlert from "../layout/ErrorAlert";

function ReservationsList({date}){

    const [tables, setTables] = useState([]);
    const [tableError, setTableError] = useState(null);

    useEffect(loadTables, []);

    function loadTables() {
        const abortController = new AbortController();
        setTableError(null);
        listTables({}, abortController.signal)
        .then(setTables)
        .catch(setTableError);
        return () => abortController.abort();
    }

    //construct list of reservation components 
    const list = tables.map((table) => (
        <Table key={table.table_id} table={table} />
    ));

    return(
        <main className="container">
            <ErrorAlert error={tableError} />
            <table className="table">
                <thead>
                    <tr>
                        <th>Table Name</th>
                        <th>Capacity</th>
                        <th>Status</th>
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