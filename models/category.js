const mongoose = require("mongoose");
const ServiceProvider = require("./serviceProvider");

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },

  icon: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  // location: {
  //   type: {
  //     type: String,
  //     enum: ["Point"],
  //     default: "Point",
  //   },
  //   coordinates: {
  //     type: [Number],
  //     index: "2dsphere", // Create a geospatial index
  //   },
  // },
  serviceProviders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceProvider",
    },
  ],
});

const Category = mongoose.model("Category", CategorySchema);

module.exports = Category;
