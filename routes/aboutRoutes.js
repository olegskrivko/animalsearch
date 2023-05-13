const express = require("express");
const router = express.Router({ mergeParams: true });
const aboutController = require("../controllers/aboutController");
const catchAsync = require("../utils/catchAsync");

// routes
router.route("/").get(catchAsync(aboutController.index));
router.route("/support").get(catchAsync(aboutController.support));
router.route("/feedback").get(catchAsync(aboutController.feedback));

module.exports = router;
