const mongoose = require('mongoose');

// Create a MongoDB schema and model
const timeseriesSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    name: String,
    origin: String,
    destination: String,
    secretKey: String,
});

const TimeseriesModel = mongoose.model('Timeseries', timeseriesSchema);

module.exports = TimeseriesModel;
