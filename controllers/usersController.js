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

// module.exports.deleteAccount = async (req, res) => {
//   console.log("Delete Account");
//   try {
//     const userId = req.user.id; // Assuming you have a user ID stored in the session or authentication data

//     const deletedUser = await User.findOneAndDelete({ _id: userId });

//     if (!deletedUser) {
//       // User not found
//       return res.status(404).json({ error: "User not found" });
//     }

//     // Additional tasks after user deletion, if needed

//     // Log out the user or clear the session after successful deletion
//     req.logout(); // Assuming you're using passport.js for authentication

//     return res.json({ message: "User deleted successfully" });
//   } catch (error) {
//     // Handle any errors that occurred during deletion
//     return res
//       .status(500)
//       .json({ error: "An error occurred during user deletion" });
//   }
// };
