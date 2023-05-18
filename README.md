## Backend for TypeScript Test Project :shamrock:

Welcome to my TypeScript Project's API! This Node.js project powers an exciting bike exploration experience, providing a seamless RESTful API to retrieve data about bike journeys and stations. This is backed by MongoDB and opens up a world of possibilities for bike enthusiasts and urban adventurers.

## Deployment :bike:

This backend project is currently deployed on Heroku at **https://stations-backend.herokuapp.com/**. However, if you want to deploy it to your own environment, continue reading about how to get started.

## Getting Started :bike:

For your adventure to start,

1. Clone this repository by running `https://github.com/ruskollin/cw.git` in your terminal.
2. Go to folder pdf by running `cd cwf`.
2. Install the required dependencies by running `npm install`. (might take time)
3. Set up a MongoDB instance and provide the MongoDB URI in an .env file as follows: `MONGODB_URI=<your_mongodb_uri>`
4. Replace <your_mongodb_uri> with the URI for your MongoDB instance.
5. Import the journey and station data into the MongoDB database.
6. The project uses collections named stations and bikes so apply these when creating collections in MongoDB or tweak them in the project.
7. Run the program by running `node index.js`.

## API Endpoints :bike:

Discover the possibilities of the API with these endpoints:

`GET /stations`: Retrieves all stations.

`GET /journeys`: Retrieves all journeys.

`POST /stations`: Retrieves data for a specific station from the MongoDB collection, including the count of total departures from the station, count of total returns to the station, average distance from the station, average distance ending at the station, popular return stations, and popular departure stations.

`POST /stations/addNew`: Adds a new station.

`POST /journeys/addNew`: Adds a new journey.

## Additional Info :bike:

 * The CSV files uploaded to MongoDB Compass were updated to convert durations to minutes and covered distances to kilometers. Unfortunately, the free version of MongoDB compass does not allocate much memory so only one dataset was fed.
 * The docker image was created but not yet fully implemented. 
