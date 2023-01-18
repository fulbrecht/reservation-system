import React from "react";

function Table({table}){

    return (
        <tr>
            <td>{table.table_name}</td>
            <td>{table.capacity}</td>
            <td>{table.reservation_id ? "Occupied" : "Free"}</td>
        </tr>
    )
}

export default Table