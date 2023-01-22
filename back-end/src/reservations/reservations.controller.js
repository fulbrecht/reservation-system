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

async function read(req, res) {
  const reservationId = req.params.reservation_Id;
  const data = await service.read(reservationId);

  res.json({
    data,
  })

}

//Create handler for reservation resources
async function create(req, res, next) {
  const newReservation = {
    ...req.body.data
  }
  const data = await service.create(newReservation);
  res.status(201).json({data});
}

//Validation Middleware

//return 400 if data is missing
function dataExists(req, res, next){
  if(req.body.data){
    return next()
  } else {
    next({ status: 400, message: `Data is missing`});
  }
}

async function reservationExists(req, res, next){
  const reservationId = req.params.reservation_Id;
  res.locals.reservation = await service.read(reservationId);

  if(!res.locals.reservation){
    next({status: 404, message: `reservation ${reservationId} not found`});
  }

  next();
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

//Date Validations
/* Return 400 if reservation_date is: 
    -Not a date
    -In the past
    -On a Tuesday
 */

function isPastDate(dateTime){
  const today = new Date();
  return today.setHours(0,0,0) >= dateTime.getTime() ? true : false;
}
function isTuesday(date){
  const resDate = new Date(date);
  return resDate.getUTCDay() === 2 ? true : false;
}

function validateDate(req, res, next){
  const resDate = req.body.data.reservation_date;
  const resTime = req.body.data.reservation_time;
  const resDateTime = new Date(`${resDate}T${resTime}`);

  if(!Date.parse(resDate)){
    next({status: 400, message: `reservation_date is not a date`});
  } else if(isPastDate(resDateTime)){
    next({status: 400, message: `reservation_date must be in the future`});
  } else if(isTuesday(resDate)){
    next({status: 400, message: `restaurant is closed on Tuesdays`});
  }
  next();
}

//Time Validations
/* Return 400 if reservation_time is: 
    -Not a time
    -In the past
    -before 10:30am
    -after 9:30pm
 */

function isValidTime(time){
  return /[0-9]{2}:[0-9]{2}/.test(time);
}

function isPastTime(dateTime){
  return Date.now() >= dateTime.getTime() ? true:false;
}

function isBeforeOpening(dateTime){
  const openTime = new Date(dateTime).setHours(10,30,0);
  return openTime >= dateTime.getTime() ? true : false;
}

function isAfterClosing(dateTime){
  const closeTime = new Date(dateTime).setHours(21,30,0);
  return closeTime <= dateTime.getTime() ? true : false;
}

function validateTime(req, res, next){
  const resDate = req.body.data.reservation_date;
  const resTime = req.body.data.reservation_time;
  const dateTime = new Date(`${resDate}T${resTime}`);

  if(!isValidTime(resTime)){
    next({status: 400, message: `reservation_time is not a time`});
  } else if(isPastTime(dateTime)){
    next({status: 400, message: `reservation_time must be in the future`});
  } else if(isBeforeOpening(dateTime)){
    next({status: 400, message: `reservation_time must be after 10:30am`});
  } else if(isAfterClosing(dateTime)){
    next({status: 400, message: `reservation_time must be before 9:30pm`});
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
  read: [reservationExists, asyncErrorBoundary(read)],
  create: [dataExists, requiredFieldsExist, validateDate, validateTime, validatePeople, asyncErrorBoundary(create)],
};
