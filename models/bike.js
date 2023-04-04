const mongoose = require('mongoose')
const dotenv = require("dotenv");
dotenv.config();
const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.set('strictQuery',false)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const bikeSchema = new mongoose.Schema({
  Departure: {
    type: String,
    minlength: 1,
    required: true,
    unique: true,
  },
  Return: {
    type: String,
    minlength:3,
    required: true
  },
  Departure_station_id: {
    type: Number,
    minlength:1,
    required: true
  },
  Departure_station_name: {
    type: String,
    minlength:1,
    required: true
  },
  Return_station_id: {
    type: Number,
    minlength:1,
    required: true
  },
  Return_station_name: {
    type: String,
    minlength:1,
    required: true
  },
  Covered_distance: {
    type: Number,
    minlength:1,
    required: true
  },
  Duration: {
    type: Number,
    minlength:1,
    required: true
  }
})

bikeSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
  },
})

module.exports = mongoose.model('bikes_may', bikeSchema)