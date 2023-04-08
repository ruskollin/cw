const mongoose = require('mongoose')
const dotenv = require("dotenv");
dotenv.config();
const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.set('strictQuery',false)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) => {
    console.log('connected to MongoDB for stations')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const stationSchema = new mongoose.Schema({
  FID: {
    type: Number,
    minlength: 1,
    required: true,
    unique: true,
  },
  ID: {
    type: Number,
    minlength:3,
    required: true
  },
  Nimi: {
    type: String,
    minlength:1,
    required: true
  },
  Namn: {
    type: String,
    minlength:1,
    required: true
  },
  Name: {
    type: String,
    minlength:1,
    required: true
  },
  Osoite: {
    type: String,
    minlength:1,
    required: true
  },
  Adress: {
    type: String,
    minlength:1,
    required: true
  },
  Kaupunki: {
    type: String,
    minlength:1,
    required: true
  },
  Stad: {
    type: String,
    minlength:1,
    required: true
  },
  Operaattor: {
    type: String,
    minlength:1,
    required: true
  },
  Kapasiteet: {
    type: Number,
    minlength:1,
    required: true
  },
  x: {
    type: Number,
    minlength:1,
    required: true
  },
  y: {
    type: Number,
    minlength:1,
    required: true
  }
})

stationSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
  },
})

module.exports = mongoose.model('Stations', stationSchema)