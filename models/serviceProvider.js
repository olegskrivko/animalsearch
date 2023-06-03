const mongoose = require("mongoose");

const ServiceProviderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  // contact: {
  //   type: String,
  //   required: true,
  // },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  socialMedia: [
    {
      type: String,
    },
  ],
  serviceType: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  // location: {
  //   type: {
  //     type: String,
  //     enum: ["Point", "Polygon"],
  //     required: true,
  //   },
  //   coordinates: {
  //     type: [[Number]],
  //     required: true,
  //   },
  // },

  website: {
    type: String,
  },
  // availability: {
  //   type: String,
  // },
});

const ServiceProvider = mongoose.model(
  "ServiceProvider",
  ServiceProviderSchema
);

module.exports = ServiceProvider;
