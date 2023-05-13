const Service = require("../models/service");

module.exports.index = async (req, res) => {
  try {
    res.render("about/index");
  } catch (err) {
    console.error(err.message);
  }
};

module.exports.support = async (req, res) => {
  try {
    res.render("about/support");
  } catch (err) {
    console.error(err.message);
  }
};

module.exports.feedback = async (req, res) => {
  try {
    res.render("about/feedback");
  } catch (err) {
    console.error(err.message);
  }
};
