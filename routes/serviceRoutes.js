const express = require("express");
const router = express.Router({ mergeParams: true });
const servicesController = require("../controllers/servicesController");
const catchAsync = require("../utils/catchAsync");

const multer = require("multer");
const { logostorage } = require("../cloudinary");
// const upload = multer({ logostorage });
const upload = multer({ storage: logostorage });
// const { isLoggedIn, isAuthor } = require("../middleware");
const { isLoggedIn, isAuthor } = require(".././middleware/middleware");

// routes
router
  .route("/")
  .get(catchAsync(servicesController.index))
  .post(
    isLoggedIn,
    upload.single("logo"),
    catchAsync(servicesController.addNewService)
  )
  .put(
    isLoggedIn,
    isAuthor,
    upload.single("logo"),
    catchAsync(servicesController.updateService)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(servicesController.deleteService));

// /new must be before /:id otherwise it will trough cast error
router.route("/new").get(isLoggedIn, servicesController.renderAddServiceForm);
router.route("/:id").get(catchAsync(servicesController.showService));

module.exports = router;
