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

app.get('/bikes', async (request, response) => {
    Bike.find({}).then(bikes => {
        response.json(bikes)
      })
})

app.use('/api/bikes', bikeRouter)

const PORT = 3007
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})