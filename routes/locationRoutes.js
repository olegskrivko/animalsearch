const express = require("express");
const locationsController = require("../controllers/locationsController");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");

// routes
router.get("/:regionName", catchAsync(locationsController.getRegion));

router.post("/", catchAsync(locationsController.createRegion));

module.exports = router;
