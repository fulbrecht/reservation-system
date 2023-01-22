import React from "react";
import Table from "./table";

function TableList({tables, loadDashboard}){

    // const [tables, setTables] = useState([]);
    // const [tableError, setTableError] = useState(null);

    // useEffect(loadTables, []);

    // function loadTables() {
    //     const abortController = new AbortController();
    //     setTableError(null);
    //     listTables({}, abortController.signal)
    //     .then(setTables)
    //     .catch(setTableError);
    //     return () => abortController.abort();
    // }

    //construct list of reservation components 
    const list = tables.map((table) => (
        <Table key={table.table_id} table={table} loadDashboard={loadDashboard}/>
    ));

    return(
        <main className="container">
            <table className="table">
                <thead>
                    <tr>
                        <th>Table Name</th>
                        <th>Capacity</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {list}
                </tbody>
            </table>
        </main>
    )
}

export default TableList;