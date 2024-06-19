if(process.env.NODE_ENV != "production") {
  require('dotenv').config();
}
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/serenestays";
const dbUrl = process.env.ATLASDB_URL;



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