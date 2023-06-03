const express = require("express");
const router = express.Router({ mergeParams: true });
const servicesController = require("../controllers/servicesController");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor } = require("../middleware");

// routes
router
  .route("/")
  .get(catchAsync(servicesController.index))
  .post(isLoggedIn, catchAsync(servicesController.addNewService));

// /new must be before /:id otherwise it will trough cast error
router.route("/new").get(isLoggedIn, servicesController.renderAddServiceForm);
router.route("/:id").get(catchAsync(servicesController.showService));

module.exports = router;
