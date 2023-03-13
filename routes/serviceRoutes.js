const express = require("express");
const router = express.Router({ mergeParams: true });
const servicesController = require("../controllers/servicesController");
const catchAsync = require("../utils/catchAsync");

// routes
router.route("/").get(catchAsync(servicesController.index));
router.route("/:id").get(catchAsync(servicesController.showService));

module.exports = router;
