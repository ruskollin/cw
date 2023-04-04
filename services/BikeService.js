const BikeModel = require("../models/bikes");
 
exports.getAllBikes = async () => {
  return await BikeModel.find();
};