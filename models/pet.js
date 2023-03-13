const mongoose = require("mongoose");
const Review = require("./review");

const imageSchema = new mongoose.Schema({
  url: String,
  filename: String,
});
// set thumbnail img size
imageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("upload", "/upload/w_200");
});

const petSchema = new mongoose.Schema(
  {
    title: String,
    images: [imageSchema],
    // geometry: {
    //   type: {
    //     type: String,
    //     enum: ["Point"],
    //   },
    //   coordinates: {
    //     type: [Number],
    //   },
    // },

    identifier: Number,
    description: String,
    species: String,
    breed: String,
    pattern: String,
    firstcolor: String,
    secondcolor: String,
    thirdcolor: String,
    coat: String,
    size: String,
    age: String,
    status: String,
    lostdate: Date,
    location: String,
    latitude: Number,
    longitude: Number,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  { timestamps: true }
);

petSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Pet", petSchema);
