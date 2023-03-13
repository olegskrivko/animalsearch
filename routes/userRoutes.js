const express = require("express");

const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const passport = require("passport");
const users = require("../controllers/usersController");
const { isLoggedIn } = require("../middleware");
// aaaa

router
  .route("/register")
  .get(users.renderRegister)
  .post(catchAsync(users.register));
router
  .route("/login")
  .get(users.renderLogin)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    users.login
  );

router.get("/logout", users.logout);

// my routes
router.route("/account").get(isLoggedIn, users.renderAccount);

module.exports = router;
