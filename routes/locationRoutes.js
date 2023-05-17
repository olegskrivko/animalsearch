const express = require("express");
const locationController = require("../controllers/locationController");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");

// routes
router.get("/:regionName", catchAsync(locationController.getRegion));

router.post("/", catchAsync(locationController.createRegion));

module.exports = router;
