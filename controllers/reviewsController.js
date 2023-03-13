const Pet = require("../models/pet");
const Review = require("../models/review");
const fns = require("date-fns");

module.exports.createReview = async (req, res) => {
  const pet = await Pet.findById(req.params.id);
  // const createDateInWords = fns.formatDistanceToNow(new Date(pet.createdAt), {
  //   addSuffix: true,
  // });
  const review = new Review(req.body.review);

  review.author = req.user._id;
  pet.reviews.push(review);
  await review.save();
  await pet.save();
  req.flash("success", "Created new review!");
  res.redirect(`/pets/${pet._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Pet.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Successfully deleted review");
  res.redirect(`/pets/${id}`);
};
