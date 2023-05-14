const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    body: String,
    //   rating: Number,
    // latitude: Number,
    // longitude: Number,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
