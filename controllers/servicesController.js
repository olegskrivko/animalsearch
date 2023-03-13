const Service = require("../models/service");

module.exports.index = async (req, res) => {
  try {
    const services = await Service.find();

    res.render("services/index", {
      services,
    });
  } catch (err) {
    console.error(err.message);
  }
};

module.exports.showService = async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    req.flash("error", "Cannot find that service!");
    return res.redirect("/services");
  }

  res.render("services/show", {
    service,
  });
};
