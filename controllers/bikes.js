const Bike = require('../models/bike')
const bikeRouter = require('express').Router()

bikeRouter.get('/', async (request, response) => {
    const bike = await Bike.find({})
    response.json(bike.map((bikes) => bikes.toJSON()))
})

module.exports = bikeRouter