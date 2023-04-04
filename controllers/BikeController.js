
const Bike = require('../models/bike')

exports.getAllBikes = async (req, res) => {
    try {
        const bikes_may = await Bike.find()
        // console.log('response', bikes_may)
    } catch (err) {
        console.log(err)
    }
};

// const bikeService = require("../services/BikeService.js");

// exports.getAllBikes = async (req, res) => {
//     try {
//       const bikes_may = await bikeService.getAllBikes();
//     //   console.log(bikes)
//     } catch (err) {
//       console.log(err)
//     }
//   };