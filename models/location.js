const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  region: {
    type: String,
    required: true,
  },
  geometry: {
    type: {
      type: String,
      enum: ["Polygon"],
      default: "Polygon",
    },
    coordinates: {
      type: [[[Number]]],
      required: true,
    },
  },
});

const Location = mongoose.model("Location", locationSchema);

module.exports = Location;
