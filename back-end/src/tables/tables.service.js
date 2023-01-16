const knex = require("../db/connection");

async function list(reservation_id) {
    if(!reservation_id){
        return knex("tables").select("*");
    } else {
        return knex("tables").select("*")
            .where('reservation_id',date);
    }
}

async function create(table) {
    return knex("tables")
        .insert(table)
        .returning("*")
        .then((result) => result[0]);
}

module.exports = {
list,
create,
};