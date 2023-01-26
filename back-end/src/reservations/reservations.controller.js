const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reservations.service");
const environment = process.env.NODE_ENV || "development";

//List handler for reservations 
async function list(req, res) {
    const query = req.query;
    // const date = req.query.date;
    // const mobile_number = req.query.mobile_number;
    const data = await service.list(query);

    res.json({
      data,
    });
}

//Read handler for reservations
async function read(req, res) {
  const reservationId = req.params.reservation_id;
  const data = await service.read(reservationId);

  res.json({
    data,
  })

}

//Create handler for reservation resources
async function create(req, res, next) {

  const cleanedMobile = req.body.data.mobile_number.replace(/\D/g,'');
  const match = cleanedMobile.match(/^(\d{3})(\d{3})(\d{4})$/);
  const newMobileNumber = match[1] + '-' + match[2] + '-' + match[3];

  const newReservation = {
    ...req.body.data,
    mobile_number: newMobileNumber,
  }
  const data = await service.create(newReservation);
  res.status(201).json({data});
}

//Update handler for reservations
async function update(req, res, next){

  const updatedReservation = {
    ...req.body.data,
    reservation_id: req.params.reservation_id,
  }
  const data = await service.update(updatedReservation);
  
  res.status(200).json({data});

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
  const reservationId = req.params.reservation_id;
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

function isValidPhone(resPhone){
  return /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/.test(resPhone)
}

function validatePhone(req, res, next){
  const resPhone = req.body.data.mobile_number;
  if(!isValidPhone(resPhone)){
    next({status: 400, message: `mobile_number is not valid`});
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

//return 400 if status is not booked
function validateNewStatus(req, res, next){
  const status = req.body.data.status;
  if(status === 'seated' || status === 'finished'){
    next({status: 400, message: `new reservation cannot have status ${status}`});
  }
  next();
}

//return 400 if status is invalid
function validateStatus(req, res, next){
  const status = req.body.data.status;
  const reservationStatus = res.locals.reservation.status;
  const validStatus = [
    "booked",
    "seated",
    "finished",
    "cancelled",
  ]

  if(reservationStatus === "finished"){
    next({status: 400, message: `a finished reservation cannot be updated`});
  }

  if(!validStatus.includes(status)){
    next({status: 400, message: `${status} is an invalid status`});
  }

  next();
}

function isBooked(req, res, next){
  const reservationStatus = res.locals.reservation.status;
  if(reservationStatus !== "booked"){
    next({status: 400, message: `Only 'booked' reservations may be edited.`});
  }

  next();
}


module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [reservationExists, asyncErrorBoundary(read)],
  create: [
    dataExists, 
    requiredFieldsExist, 
    validateDate, 
    validateTime, 
    validatePeople, 
    validatePhone,
    validateNewStatus, 
    asyncErrorBoundary(create)
  ],
  updateStatus: [reservationExists, validateStatus, asyncErrorBoundary(update)],
  update: [
    reservationExists, 
    dataExists, 
    requiredFieldsExist, 
    validateDate, 
    validateTime, 
    validatePeople,
    isBooked, 
    asyncErrorBoundary(update)]
};
