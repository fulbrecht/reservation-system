import React from "react";
import { finishTable } from "../utils/api";

function Table({table, loadDashboard}){

    const handleClick = () => {
        if(window.confirm('Is this table ready to seat new guests? This cannot be undone.') === true) {
            finishTable(table.table_id).then(()=> loadDashboard());
        }
      }

    return (
        <tr>
            <td>{table.table_name}</td>
            <td>{table.capacity}</td>
            <td data-table-id-status={table.table_id}>{table.reservation_id ? "Occupied" : "Free"}</td>
            <td><button data-table-id-finish={table.table_id} onClick={handleClick}>Finish</button></td>
        </tr>
    )
}

export default Table