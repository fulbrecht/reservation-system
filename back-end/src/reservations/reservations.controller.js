const service = require("./reservations.service");

/**
 * List handler for reservation resources
 */
 const environment = process.env.NODE_ENV || "development";

async function list(req, res) {

    const date = req.query.date;
    const data = await service.list(date);

    res.json({
      data,
    });
}

module.exports = {
  list,
};
