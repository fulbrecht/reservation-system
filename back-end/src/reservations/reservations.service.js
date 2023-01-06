const knex = require("../db/connection");

async function list(date) {
    if(!date){
        return knex("reservations").select("*");
    } else {
        return knex("reservations").select("*")
            .where('reservation_date',date);
    }
}

async function create(reservation) {
    return knex("reservations")
        .insert(reservation)
        .returning("*")
        .then((result) => result[0]);
}

module.exports = {
list,
create,
};