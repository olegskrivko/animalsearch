const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const usersController = require("../controllers/usersController");
const { isLoggedIn } = require("../middleware/middleware");

// Register Route
router
  .route("/register")
  .get(usersController.renderRegister)
  .post(catchAsync(usersController.register));

// Login Route
router
  .route("/login")
  .get(usersController.renderLogin)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    usersController.login
  );

// Logout Route
router.get("/logout", usersController.logout);

// Account Routes
router
  .route("/account/profile")
  .get(isLoggedIn, usersController.renderAccountProfile)
  .put(isLoggedIn, usersController.updateAccount)
  .delete(isLoggedIn, usersController.deleteAccount);

router
  .route("/account/settings")
  .get(isLoggedIn, usersController.renderAccountSettings);

router
  .route("/account/watchlist")
  .get(isLoggedIn, usersController.renderAccountWatchlist);

module.exports = router;
