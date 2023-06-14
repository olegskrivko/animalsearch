const mongoose = require("mongoose");

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
  // coverImage: {
  //   type: String, // or you can use `Buffer` if storing images as binary data
  //   required: true,
  // },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  serviceProviders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceProvider",
    },
  ],
});

const Category = mongoose.model("Category", CategorySchema);

module.exports = Category;
