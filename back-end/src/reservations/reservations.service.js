const knex = require("../db/connection");

async function list({date, mobile_number}) {

    let reservations = knex("reservations").select("*").orderBy('reservation_time', 'asc')
    if(date){
        reservations.where('reservation_date', date).whereNot('status', 'finished');
    }

    if(mobile_number){
        reservations
            .whereRaw(
                "translate(mobile_number, '() -', '') like ?",
                `%${mobile_number.replace(/\D/g, "")}%`
            )
            .orderBy("reservation_date");
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