const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
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

async function create(req, res, next) {
  const newReservation = {
    ...req.body.data
  }
  const data = await service.create(newReservation);
  res.status(201).json({data});
}

module.exports = {
  list,
  create: asyncErrorBoundary(create),
};
