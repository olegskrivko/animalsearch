const User = require("../models/user");

// Controller for rendering the registration form
module.exports.renderRegister = (req, res) => {
  res.render("auth/register");
};

// Controller for user registration
module.exports.register = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });

    // Register the user using the provided password
    const registeredUser = await User.register(user, password);

    // Save the registered user
    await registeredUser.save();

    // Log in the registered user
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Registration successful!"); // Flash message for successful registration
      res.redirect("/pets");
    });
  } catch (error) {
    // Handle errors during registration
    req.flash("error", error.message);
    res.redirect("auth/register");
  }
};

// Controller for rendering the login page
module.exports.renderLogin = (req, res) => {
  res.render("auth/login"); // Render the login view
};

// Controller for user login
module.exports.login = (req, res) => {
  // Retrieve the user's name
  const { username } = req.user;

  // Display a flash message with a welcome greeting and the user's name
  req.flash("success", `Welcome, ${username}!`);

  // Retrieve the redirect URL from the session or set a default value
  const redirectUrl = req.session.returnTo || "/pets";

  // Delete the returnTo property from the session to prevent future redirections
  delete req.session.returnTo;

  // Redirect the user to the determined URL
  res.redirect(redirectUrl);
};

// Controller for user logout
module.exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Logout error:", err);
      // Handle the error appropriately, such as displaying an error message
      req.flash("error", "Failed to logout.");
    } else {
      // Display a flash message indicating successful logout
      req.flash("success", "You have been logged out successfully!");

      // Redirect the user to the desired page after logout
      res.redirect("/pets");
    }
  });
};

// Controller for rendering the account page
module.exports.renderAccountProfile = (req, res) => {
  try {
    // Render the account page template
    res.render("auth/profile");
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error rendering account page:", error);

    // Handle the error appropriately, such as displaying an error message or redirecting to an error page
    req.flash("error", "Failed to render account page.");
    res.redirect("/pets"); // Redirect to an appropriate error page or fallback route
  }
};

// Controller for rendering the account settings page
module.exports.renderAccountSettings = (req, res) => {
  try {
    // Render the account settings page template
    res.render("auth/settings");
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error rendering account page:", error);

    // Handle the error appropriately, such as displaying an error message or redirecting to an error page
    req.flash("error", "Failed to render account page.");
    res.redirect("/pets"); // Redirect to an appropriate error page or fallback route
  }
};

// Controller for rendering the account watchlist page
module.exports.renderAccountWatchlist = (req, res) => {
  try {
    // Render the account watchlist page template
    res.render("auth/watchlist");
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error rendering account page:", error);

    // Handle the error appropriately, such as displaying an error message or redirecting to an error page
    req.flash("error", "Failed to render account page.");
    res.redirect("/pets"); // Redirect to an appropriate error page or fallback route
  }
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

// Controller for updating user account information
module.exports.updateAccount = async (req, res) => {
  try {
    const { email, username } = req.body;
    const user = req.user; // Assuming the authenticated user's data is stored in req.user

    // Update the user's email and username
    user.set({ email, username });

    // Save the updated user data
    await user.save();

    // Update the session with the new user data
    req.session.user = user;

    // Flash a success message
    req.flash("success", "Account updated successfully!");

    // Redirect to the account page or any other appropriate page
    res.redirect("/auth/account");
  } catch (error) {
    console.error("Error updating account:", error);

    // Flash an error message
    req.flash("error", "Failed to update account. Please try again.");

    // Redirect to the account page or any other appropriate page
    res.redirect("/auth/account");
  }
};

// module.exports.updateAccount = async (req, res) => {
//   try {
//     const { email, username } = req.body;
//     const user = req.user; // Assuming the authenticated user's data is stored in req.user

//     // Update the user's email and username
//     user.email = email;
//     user.username = username;

//     // Save the updated user data
//     await user.save();

//     // Update the session with the new user data
//     req.session.user = user;

//     // Flash a success message
//     req.flash("success", "Account updated successfully!");

//     // Redirect to the account page or any other appropriate page
//     res.redirect("/auth/account");
//   } catch (error) {
//     console.error("Error updating account:", error);

//     // Flash an error message
//     req.flash("error", "Failed to update account. Please try again.");

//     // Redirect to the account page or any other appropriate page
//     res.redirect("/auth/account");
//   }
// };

// module.exports.updateAccount = async (req, res) => {
//   try {
//     const { email, username } = req.body;
//     const user = req.user; // Assuming the authenticated user's data is stored in req.user

//     // Update the user's email and username
//     user.email = email;
//     user.username = username;

//     // Save the updated user data
//     await user.save();

//     // Flash a success message
//     req.flash("success", "Account updated successfully!");

//     // Redirect to the account page or any other appropriate page
//     res.redirect("/account");
//   } catch (error) {
//     console.error("Error updating account:", error);

//     // Flash an error message
//     req.flash("error", "Failed to update account. Please try again.");

//     // Redirect to the account page or any other appropriate page
//     res.redirect("/account");
//   }
// };

module.exports.updateAccount = async (req, res, next) => {
  const { username } = req.body;
  const userId = req.user._id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username },
      { new: true }
    );

    // Update the session with the new username
    req.login(updatedUser, (err) => {
      if (err) {
        console.error("Error updating session:", err);
        // Handle the error appropriately
      }

      // Redirect the user to a success page or refresh the current page
      res.redirect("/account");
    });
  } catch (error) {
    console.error("Error updating account:", error);
    // Handle the error appropriately
  }
};

// WORKS, but need callback logout

// module.exports.deleteAccount = async (req, res) => {
//   try {
//     // Assuming the authenticated user's data is stored in req.user
//     const user = req.user;

//     // Delete the user
//     await user.remove();

//     // Clear the session and log out the user
//     req.logout();

//     // Flash a success message
//     req.flash("success", "Account deleted successfully!");

//     // Redirect to a landing page or any other appropriate page
//     res.redirect("/");
//   } catch (error) {
//     console.error("Error deleting account:", error);

//     // Flash an error message
//     req.flash("error", "Failed to delete account. Please try again.");

//     // Redirect to the account page or any other appropriate page
//     res.redirect("/auth/account");
//   }
// };

/////NEW IT HAS CALLBACK WHICH IS REAUIRED
module.exports.deleteAccount = async (req, res) => {
  try {
    const user = req.user; // Assuming the authenticated user's data is stored in req.user

    // Delete the user account
    await user.remove();

    // Logout the user session
    req.logout(function (err) {
      if (err) {
        console.error("Error logging out:", err);
        req.flash("error", "Failed to delete account. Please try again.");
        res.redirect("/account");
        return;
      }

      // Flash a success message
      req.flash("success", "Account deleted successfully!");

      // Redirect to the homepage or any other appropriate page
      res.redirect("/");
    });
  } catch (error) {
    console.error("Error deleting account:", error);

    // Flash an error message
    req.flash("error", "Failed to delete account. Please try again.");

    // Redirect to the account page or any other appropriate page
    res.redirect("/account");
  }
};
