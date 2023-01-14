const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reservations.service");
const environment = process.env.NODE_ENV || "development";

//List handler for reservation resources
async function list(req, res) {

    const date = req.query.date;
    const data = await service.list(date);

    res.json({
      data,
    });
}

//Create handler for reservation resources
async function create(req, res, next) {
  const newReservation = {
    ...req.body.data
  }
  const data = await service.create(newReservation);
  res.status(201).json({data});
}

//Validation middleware


//return 400 if data is missing
function dataExists(req, res, next){
  if(req.body.data){
    return next()
  } else {
    next({ status: 400, message: `Data is missing`});
  }
}

//Validate required fields exist
const requiredFields = [
  'first_name',
  'last_name',
  'mobile_number',
  'reservation_date',
  'reservation_time',
  'people',
]

function fieldExists(req, field){
  if(req.body.data[field]){
    return true;
  } else {
    return false;
  }
}

function requiredFieldsExist(req, res, next){
  requiredFields.forEach( field => {
      if(!fieldExists(req, field)){
        next({status: 400, message: `${field} field is missing`});
      }
    }
  )
  next();
}

//return 400 if reservation_date is not a date
function validateDate(req, res, next){
  if(!Date.parse(req.body.data.reservation_date)){
    next({status: 400, message: `reservation_date is not a date`});
  }
  next();
}

//return 400 if reservation_time is not a time
function validateTime(req, res, next){
  const isValid = /[0-9]{2}:[0-9]{2}/.test(req.body.data.reservation_time);
  if(!isValid){
    next({status: 400, message: `reservation_time is not a time`});
  }
  next();
}

//return 400 if people is not a number
function validatePeople(req, res, next){
  if(typeof req.body.data.people !== 'number'){
    next({status: 400, message: `people is not a number`});
  }
  next();
}




module.exports = {
  list,
  create: [dataExists, requiredFieldsExist, validateDate, validateTime, validatePeople, asyncErrorBoundary(create)],
};
