const knex = require("../db/connection");

async function list(status) {
    if(!status){
        return knex("tables")
            .select("*")
            .orderBy("table_name")
    } else if(status === "free"){
        return knex("tables")
            .select("*")
            .whereNull('reservation_id')
            .orderBy("table_name")
    } else if(status === "occupied"){
        return knex("tables")
            .select("*")
            .whereNotNull('reservation_id')
            .orderBy("table_name")
    }
}

async function read(tableId) {
    return knex("tables as t")
        .where({"t.table_id": tableId})
        .first();
}

async function create(table) {
    return knex("tables")
        .insert(table)
        .returning("*")
        .then((result) => result[0]);
}

async function update(updatedTable) {
    await knex("tables")
        .where({ table_id: updatedTable.table_id })
        .update(updatedTable, "*");

    return knex("tables as t")
        .where({ table_id: updatedTable.table_id })
        .then((data) => data[0]);
        
}

async function statusUpdate(updatedTable, updatedReservation) {
    await knex.transaction(async trx => {
        await trx("tables")
            .where({ table_id: updatedTable.table_id })
            .update(updatedTable,"*");
        await trx("reservations")
            .where({ reservation_id: updatedReservation.reservation_id })
            .update(updatedReservation, "*");

    })

    return knex("tables as t")
        .where({ table_id: updatedTable.table_id })
        .then((data) => data[0]);

}

async function finish(){
    
}


module.exports = {
    list,
    read,
    create,
    update,
    statusUpdate,
};