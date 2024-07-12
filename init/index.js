if(process.env.NODE_ENV != "production") {
  require('dotenv').config();
}
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

// const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
// const mapToken = process.env.MAP_TOKEN
// const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// const MONGO_URL = "mongodb://127.0.0.1:27017/serenestays";
const dbUrl = process.env.ATLASDB_URL;

// let getcoordinates = async (location,country) => {
//   console.log(`${location} in ${country}`);
//   let response = await geocodingClient.forwardGeocode({
//     query: location+", "+ country ,
//     limit: 1
//   }).send();
//   console.log(response.body.features[0].geometry);
//   return response.body.features[0].geometry;
// };

async function main() {
  await mongoose.connect(dbUrl);
}

main()
  .then((res) => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.log(err);
  });

const initDB = async ()=> {
    await Listing.deleteMany({});
    initData.data = initData.data.map( (obj) => ({...obj, owner: "6672ec9595e6ab197a358ede"}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized !!");
};

initDB();