const knex = require("../db/connection");

async function list(date) {

    let reservations = knex("reservations").select("*").orderBy('reservation_time', 'asc').whereNot('status', 'finished')
    if(date){
        reservations.where('reservation_date', date);
    }

    return await reservations;

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

async function update(updatedReservation) {
    await knex("reservations")
        .where({ reservation_id: updatedReservation.reservation_id })
        .update(updatedReservation, "*");

    return knex("reservations as r")
        .where({ reservation_id: updatedReservation.reservation_id })
        .then((data) => data[0]);
        
}

module.exports = {
list,
read,
create,
update,
};