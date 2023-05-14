const express = require("express");
const router = express.Router();
const petsController = require("../controllers/petsController");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor, validatePet } = require("../middleware");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

const Pet = require("../models/pet");

router
  .route("/")
  .get(catchAsync(petsController.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validatePet,
    catchAsync(petsController.createPet)
  );
router.get("/report", isLoggedIn, petsController.renderNewForm);
router.get("/report/missing", isLoggedIn, petsController.renderMissingForm);
router.get("/report/found", isLoggedIn, petsController.renderFoundForm);

router
  .route("/:id")
  .get(catchAsync(petsController.showPet))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validatePet,
    catchAsync(petsController.updatePet)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(petsController.deletePet));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(petsController.renderEditForm)
);

router.get(
  "/:id/download-pdf",
  isLoggedIn,
  catchAsync(petsController.renderPdf)
);

module.exports = router;
