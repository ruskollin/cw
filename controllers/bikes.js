const Bike = require('../models/bike')
const bikeRouter = require('express').Router()

bikeRouter.get('/', async (request, response) => {
    const bike = await Bike.find({})
    response.json(bike.map((bikes) => bikes.toJSON()))
})

// bikeRouter.get('/', async (request, response, next) => {
//     try {
//         const bikes = await Bike.find()
//         console.log(response);
//     } catch (err) {
//         next(err)
//     }
// })

module.exports = bikeRouter