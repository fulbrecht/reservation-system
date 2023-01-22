const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./tables.service");
const reservationsService = require("../reservations/reservations.service");
const environment = process.env.NODE_ENV || "development";

//List handler for tables
async function list(req, res) {

    const status = req.query.status;
    const data = await service.list(status);

    res.json({
      data,
    });
}

//Create handler for tables 
async function create(req, res, next) {
  const newTable = {
    ...req.body.data
  }
  const data = await service.create(newTable);
  res.status(201).json({data});
}

//Update handler for tables
async function update(req, res, next){

  const updatedTable = {
    ...req.body.data,
    table_id: req.params.tableId,
  }
  const data = await service.update(updatedTable);
  res.json({data});
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

//Validate required fields exist
const requiredFieldsPOST = [
  'table_name',
  'capacity',
]

const requiredFieldsPUT = [
  'reservation_id'
]

function fieldExists(req, field){
  if(req.body.data[field]){
    return true;
  } else {
    return false;
  }
}

function requiredFieldsExist(req, res, next){

  let requiredFields;

  console.log(req.method);
  switch(req.method){
    case "POST":
      requiredFields = requiredFieldsPOST;
      break;
    case "PUT":
      requiredFields = requiredFieldsPUT;
      break;
  }

  requiredFields.forEach( field => {
      if(!fieldExists(req, field)){
        next({status: 400, message: `${field} field is missing`});
      }
    }
  )
  next();
}

//return 400 if table name is too short
function validateName(req, res, next){
  if(req.body.data.table_name.length <= 1){
    next({status: 400, message: `table_name is too short`});
  }
  next();
}

//return 400 if capacity is not a number
function validateCapacity(req, res, next){
  if(typeof req.body.data.capacity !== 'number'){
    next({status: 400, message: `capacity is not a number`});
  }
  next();
}

//return 400 if table is occupied
async function isFree(req, res, next){
  const tableId = req.params.tableId
  const table = await service.read(tableId);
  res.locals.table = table;

  if(table.reservation_id){
    next({status: 400, message: `table is occupied`});
  }
  next();
}

//return 400 if capacity less than people in reservation
async function capacityCheck(req, res, next){
  const reservation = res.locals.reservation
  const tableCapacity = res.locals.table.capacity;
  
  if(reservation.people > tableCapacity){
    next({status: 400, message: `table capacity too small`});
  }
  
  next();
}

//return 404 if reservation does not exist
async function reservationExists(req, res, next){
  const reservationId = req.body.data.reservation_id;
  res.locals.reservation = await reservationsService.read(reservationId);

  if(!res.locals.reservation){
    next({status: 404, message: `reservation ${reservationId} not found`});
  }

  next();
}


module.exports = {
  list,
  create: [dataExists, requiredFieldsExist, validateName, validateCapacity, asyncErrorBoundary(create)],
  update: [dataExists, requiredFieldsExist, reservationExists, isFree, capacityCheck, asyncErrorBoundary(update)]
};
