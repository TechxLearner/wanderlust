const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main().then(() => {
    console.log("Connected to DB");
}).catch((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect(process.env.MONGO_URL);
}


const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "697c4e8938866f238f634632"}));
    await Listing.insertMany(initData.data);
    console.log("Data initilization Successfull");
}

initDB();