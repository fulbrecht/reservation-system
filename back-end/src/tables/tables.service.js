const knex = require("../db/connection");

async function list(status) {
    if(!status){
        return knex("tables").select("*");
    } else if(status === "free"){
        return knex("tables").select("*")
            .whereNull('reservation_id')
    } else if(status === "occupied"){
        return knex("tables").select("*")
            .whereNotNull('reservation_id')
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