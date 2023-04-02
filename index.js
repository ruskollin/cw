const express = require('express')
const app = express()
const { getAllStations } = require("./controllers/StationController");
const Station = require('./models/station')

app.use(express.json())

app.get('/stations', (request, response) => {
    Station.find({}).then(stations => {
        response.json(stations)
      })
})

const PORT = 3007
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})