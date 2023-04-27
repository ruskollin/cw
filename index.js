const express = require('express')
const app = express()
const cors = require('cors')
const Station = require('./models/station')
const Bike = require('./models/bike')

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

    // const skip = (page - 1) * limit;
    // console.log(page, limit, skip)
    const journeys = await Bike.find()
        // .skip(skip)
        .limit(limit);
    response.json(journeys);
    // Bike.find({}).then(bikes => {
    //     response.json(bikes[0])
    //   })
})

app.get('/journeys/search', async (request, response) => {
    console.log(request.query)
    // let value = request.query.filterWord * 60
    // console.log('to find duration with value: ', value)
    // var query = { Duration: new RegExp(400)};
    // let limit = 1000
    // const bikes = await Bike.find(query).limit(limit)
    // response.json(bikes);
})

app.post('/stations', async (request, response) => {
    const stationName = request.body.params.stationName;
    const chosenMonth = request.body.params.month;
    const year = new Date().getFullYear();
    const monthNumber = new Date(`${chosenMonth} 1, ${year}`).getMonth() + 1;

    let departuresFromStation = [];
    const departureQueryAll = { Departure_station_name: stationName };
    const departureQueryMonthly = {
        Departure_station_name: stationName,
        $expr: {
            $eq: [{ $month: "$Departure" }, monthNumber]
        }
    };

    let returnsToStation = [];
    const returnQueryAll = { Return_station_name: stationName };
    const returnQueryMonthly = {
        Return_station_name: stationName,
        $expr: {
            $eq: [{ $month: "$Return" }, monthNumber]
        }
    };

    if (chosenMonth !== 'All') {
        departuresFromStation = await Bike.find(departureQueryMonthly);
        returnsToStation = await Bike.find(returnQueryMonthly);
    } else {
        departuresFromStation = await Bike.find(departureQueryAll);
        returnsToStation = await Bike.find(returnQueryAll)
    }

    var stationQuery = { Nimi: stationName };
    const stationDetails = await Station.find(stationQuery)

    const totalDistanceDepartures = departuresFromStation.reduce((acc, journey) => acc + journey.Covered_distance, 0);
    const averageDistanceFromStation = totalDistanceDepartures / departuresFromStation.length;

    const totalDistanceReturns = returnsToStation.reduce((acc, journey) => acc + journey.Covered_distance, 0);
    const averageDistanceEndingAtStation = totalDistanceReturns / returnsToStation.length;

    const countsPopularReturnStations = departuresFromStation.reduce((acc, journey) => {
        const returnStation = journey.Return_station_name;
        acc[returnStation] = (acc[returnStation] || 0) + 1;
        return acc;
    }, {});

    const popularReturnStationsList = Object.entries(countsPopularReturnStations)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([returnStation, count]) => ({ returnStation, count }));

    const countsPopularDepartureStations = returnsToStation.reduce((acc, journey) => {
        const departureStation = journey.Departure_station_name;
        acc[departureStation] = (acc[departureStation] || 0) + 1;
        return acc;
    }, {});

    const popularDepartureStationsList = Object.entries(countsPopularDepartureStations)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([departureStation, count]) => ({ departureStation, count }));

    response.json({
        stationName: stationDetails,
        earliestDeparture: departuresFromStation[0],
        totalDeparturesFromStation: departuresFromStation.length,
        earliestReturn: returnsToStation[0],
        totalReturnsToStation: returnsToStation.length,
        averageDistanceFromStation: averageDistanceFromStation,
        averageDistanceEndingAtStation: averageDistanceEndingAtStation,
        popularReturnStationsList: popularReturnStationsList,
        popularDepartureStationsList: popularDepartureStationsList
    });
})

app.post('/stations/:stationName/:month', async (request, response) => {
    console.log(request.body)
})

app.post('/stations/addNew', async (request, response) => {
    console.log('Incoming data... ', request.body)

    try {
        const dataStation = request.body
        const newStation = new Station({ ID: 0, Namn: dataStation.nameStation, Name: dataStation.nameStation, Osoite: dataStation.address, Stad: dataStation.city, FID: 0, Nimi: dataStation.nameStation, Adress: dataStation.address, Kaupunki: dataStation.city, Operaattor: dataStation.operator, Kapasiteet: dataStation.capacity, x: dataStation.xMap, y: dataStation.yMap });
        newStation.save()
        .then(doc => {
          console.log('New staton saved:', doc);
        })
        .catch(err => {
          console.error('Error inserting station:', err);
        });
    } catch (err) {
        console.log('Error: ', err)
    }
})


const PORT = 3007
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})