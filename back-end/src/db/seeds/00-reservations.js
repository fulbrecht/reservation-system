const reservationsJSON = require("./00-reservations.json");

exports.seed = function (knex) {
  return knex.raw("TRUNCATE TABLE reservations RESTART IDENTITY CASCADE")
    .then(function () {
      // Inserts seed entries
      //console.log(reservationsJSON)
      return knex('reservations').insert(reservationsJSON);
    });
};