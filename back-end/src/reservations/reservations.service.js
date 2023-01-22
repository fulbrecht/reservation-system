const knex = require("../db/connection");

async function list(date) {
    if(!date){
        return knex("reservations").select("*")
            .orderBy(['reservation_date','reservation_time']);
    } else {
        return knex("reservations").select("*")
            .where('reservation_date',date)
            .orderBy('reservation_time', 'asc' );
    }
}

async function read(reservationId){
    return knex("reservations as r")
        .where({"r.reservation_id": reservationId})
        .first();
}

async function create(reservation) {
    return knex("reservations")
        .insert(reservation)
        .returning("*")
        .then((result) => result[0]);
}

module.exports = {
list,
read,
create,
};