const express = require('express')
const app = express()
const cors = require('cors')
const Station = require('./models/station')
const Bike = require('./models/bike')
const bikeRouter = require('./controllers/bikes')

app.use(express.json())
app.use(cors())

app.get('/stations', (request, response) => {
    Station.find({}).then(stations => {
        response.json(stations)
    })
})

app.get('/journeys', async (request, response) => {
    let page = request.query.pageNum
    let limit = 10000

    const skip = (page - 1) * limit;
    // console.log(page, limit, skip)
    const bikes = await Bike.find()
        .skip(skip)
        .limit(limit);
    response.json(bikes);
    // Bike.find({}).then(bikes => {
    //     response.json(bikes[0])
    //   })
})

app.get('/journeys/search', async (request, response) => {
    let value = request.query.filterWord * 60
    console.log('to find duration with value: ', value)
    var query = { Duration: new RegExp(400)};
    let limit = 1000
    const bikes = await Bike.find(query).limit(limit)
    response.json(bikes);
})

app.post('/stations', async (request, response) => {
    let stationName = request.body.params.stationName
    var departureQuery = { Departure_station_name: stationName};
    const departuresFromStation = await Bike.find(departureQuery)
    var returnQuery = { Return_station_name: stationName};
    const returnsToStation = await Bike.find(returnQuery)
    response.json({earliestDeparture: departuresFromStation[0], totalDeparturesFromStation: departuresFromStation.length, earliestReturn: returnsToStation[0], totalReturnsToStation: returnsToStation.length});
})

const PORT = 3007
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})