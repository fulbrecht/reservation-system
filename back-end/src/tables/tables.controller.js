const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./tables.service");
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
  const newTable = {
    ...req.body.data
  }
  const data = await service.create(newTable);
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

//Validate required fields exist
const requiredFields = [
  'table_name',
  'capacity',
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


//return 400 if capacity is not a number
function validateCapacity(req, res, next){
  if(typeof req.body.data.capacity !== 'number'){
    next({status: 400, message: `capacity is not a number`});
  }
  next();
}




module.exports = {
  list,
  create: [dataExists, requiredFieldsExist, validateCapacity, asyncErrorBoundary(create)],
};
