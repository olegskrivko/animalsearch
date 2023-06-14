const Pet = require("../models/pet");
//const Review = require("../models/review");
const Comment = require("../models/comment");

module.exports.createComment = async (req, res) => {
  const { id } = req.params;

  try {
    const pet = await Pet.findById(id);
    const newComment = new Comment(req.body.comment);

    newComment.author = req.user._id;
    pet.comments.push(newComment);

    await newComment.save();
    await pet.save();

    req.flash("success", "Successfully added a new comment!");
    res.redirect(`/pets/${pet._id}`);
  } catch (error) {
    console.error(error);
    req.flash("error", "Failed to add a new comment");
    res.redirect(`/pets/${id}`);
  }
};

module.exports.deleteComment = async (req, res) => {
  const { id, commentId } = req.params;

  try {
    await Pet.findByIdAndUpdate(id, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId);

    req.flash("success", "Successfully deleted comment");
    res.redirect(`/pets/${id}`);
  } catch (error) {
    console.error(error);
    req.flash("error", "Failed to delete comment");
    res.redirect(`/pets/${id}`);
  }
};

// module.exports.createReview = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const pet = await Pet.findById(id);
//     const review = new Review(req.body.review);

//     review.author = req.user._id;
//     pet.reviews.push(review);

//     await review.save();
//     await pet.save();

//     req.flash("success", "Created new review!");

//     res.redirect(`/pets/${pet._id}`);
//   } catch (error) {
//     console.error(error);
//     req.flash("error", "Failed to add a new comment");
//     res.redirect(`/pets/${id}`);
//   }
// };

// module.exports.deleteReview = async (req, res) => {
//   const { id, reviewId } = req.params;

//   try {
//     await Pet.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

//     await Review.findByIdAndDelete(reviewId);

//     req.flash("success", "Successfully deleted comment");
//     res.redirect(`/pets/${id}`);
//   } catch (error) {
//     console.error(error);
//     req.flash("error", "Failed to delete comment");
//     res.redirect(`/pets/${id}`);
//   }
// };
