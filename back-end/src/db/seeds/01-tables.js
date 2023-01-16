const tablesJSON = require("./01-tables.json");

exports.seed = function (knex) {
  return knex.raw("TRUNCATE TABLE tables RESTART IDENTITY CASCADE")
    .then(function () {
      // Inserts seed entries
      //console.log(reservationsJSON)
      return knex('tables').insert(tablesJSON);
    });
};
