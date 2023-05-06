const stationService = require("../services/StationService.js");

exports.getAllStations = async (req, res) => {
    try {
      const stations = await stationService.getAllStations();
      // res.json({ data: stations, status: "success" });
    } catch (err) {
      console.log(err)
    }
  };