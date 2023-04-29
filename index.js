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
        .sort({ _id: -1 })
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

async function getIDLastStation() {
    const latestStation = await Station.findOne().sort({ FID: -1 }).exec();
    return { latestStationFID: latestStation.FID, latestStationID: latestStation.ID };
}

app.post('/stations/addNew', async (request, response) => {
    console.log('Incoming station data... ', request.body)

    try {
        const dataStation = request.body
        const latestStationData = await getIDLastStation()
        const latestStationFID = latestStationData.latestStationFID
        const latestStationID = latestStationData.latestStationID

        const newStation = new Station({ FID: latestStationFID + 1, ID: latestStationID + 1, Namn: dataStation.nameStation, Name: dataStation.nameStation, Osoite: dataStation.address, Stad: dataStation.city, Nimi: dataStation.nameStation, Adress: dataStation.address, Kaupunki: dataStation.city, Operaattor: dataStation.operator, Kapasiteet: dataStation.capacity, x: dataStation.xMap, y: dataStation.yMap });
        newStation.save()
            .then(doc => {
                console.log('Successfully saved:', doc);
                response.status(200).json({ success: true, message: 'Data saved successfully', document: doc });
            })
            .catch(err => {
                console.error('Error inserting station:', err);
                response.status(500).json({ success: false, message: `${err}` });
            });
    } catch (err) {
        console.error('Error: ', err)
        response.status(500).json({ success: false, message: `${err}` });
    }
})

app.post('/journeys/addNew', async (request, response) => {
    console.log('Incoming journey data... ', request.body)

    const departureID = await Station.find({ Nimi: request.body.Departure_station_name })
    const returnID = await Station.find({ Nimi: request.body.Return_station_name })

    try {
        const dataJourney = request.body
        const newJourney = new Bike({ Return_station_id: returnID[0].ID, Departure_station_id: departureID[0].ID, Duration: dataJourney.Duration, Covered_distance: dataJourney.Covered_distance, Departure: dataJourney.Departure, Departure_station_name: dataJourney.Departure_station_name, Return: dataJourney.Return, Return_station_name: dataJourney.Return_station_name });
        newJourney.save()
            .then(doc => {
                console.log('Successfully saved:', doc);
                response.status(200).json({ success: true, message: 'Data saved successfully', document: doc });
            })
            .catch(err => {
                console.error('Error inserting station:', err);
                response.status(500).json({ success: false, message: `${err}` });
            });
    } catch (err) {
        console.error('Error: ', err)
        response.status(500).json({ success: false, message: `${err}` });
    }
})

const PORT = 3007
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})