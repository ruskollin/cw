const StationModel = require("../models/station");
 
exports.getAllStations = async () => {
  return await StationModel.find();
};