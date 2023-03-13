const User = require("../models/user");

module.exports.renderRegister = (req, res) => {
  res.render("auth/register");
};

module.exports.register = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      //   req.flash("success", "Welcome to YieldCamp!");
      res.redirect("/pets");
    });
    // req.flash("success", "Welcome to YieldCamp!");
    // res.redirect("/campgrounds");
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("auth/register");
  }
};

module.exports.renderLogin = (req, res) => {
  res.render("auth/login");
};

module.exports.login = (req, res) => {
  req.flash("success", "welcome back");
  const redirectUrl = req.session.returnTo || "/pets";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
  req.logout(() => {
    req.flash("success", "Goodbye!");
    res.redirect("/pets");
  });
};

// my controls
module.exports.renderAccount = (req, res) => {
  res.render("auth/account");
};
module.exports.deleteAccount = (req, res) => {
  console.log("Delete Account");
};
