const mongoose = require('mongoose');

// Connect to local MongoDB database
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });

//setting it to db
const db = mongoose.connection;

//if error
db.on("error", console.error.bind(console, "Error connecting to DB"));

//when db connects successfully
db.once("open", function(){
    console.log("Connected to Database :: mongoDB");
});

module.exports = db;