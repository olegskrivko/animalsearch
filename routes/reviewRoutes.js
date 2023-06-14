const express = require("express");
const router = express.Router({ mergeParams: true });
//const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require(".././middleware/middleware");

const Pet = require("../models/pet");
const reviews = require("../controllers/reviewsController");
const Review = require("../models/review");
const catchAsync = require("../utils/catchAsync");

router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
);

module.exports = router;
