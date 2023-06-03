const ServiceProvider = require("../models/serviceProvider");
const Service = require("../models/service");
const Category = require("../models/category");

module.exports.renderAddServiceForm = (req, res) => {
  res.render("services/new");
};

// module.exports.addNewService = async (req, res, next) => {
//   const unprocessedBody = {
//     name: req.body.name,
//     serviceType: req.body.serviceType,
//   };

//   const serviceProvider = new ServiceProvider(unprocessedBody);

//   serviceProvider.author = req.user._id;

//   serviceProvider.save(); // await is needed? and next
//   console.log(serviceProvider);
//   req.flash("success", "Successfully added new service");
//   //res.redirect(`/services/${pet._id}`);
//   res.redirect(`/services`);
// };

// module.exports.index = async (req, res) => {
//   try {
//     const services = await Service.find();

//     res.render("services/index", {
//       services,
//     });
//   } catch (err) {
//     console.error(err.message);
//   }
// };

module.exports.index = async (req, res) => {
  try {
    const categories = await Category.find();

    res.render("services/index", {
      categories,
    });
  } catch (err) {
    console.error(err.message);
  }
};

// module.exports.showService = async (req, res) => {
//   const service = await Service.findById(req.params.id);

//   if (!service) {
//     req.flash("error", "Cannot find that service!");
//     return res.redirect("/services");
//   }

//   res.render("services/show", {
//     service,
//   });
// };

module.exports.showService = async (req, res) => {
  // const category = await Category.findById(req.params.id)
  //   .populate("serviceProviders")
  //   .exec();

  const category = await Category.findById(req.params.id)
    .populate("serviceProviders")
    .exec();

  console.log(category);

  //   .populate({
  //     path: "ServiceProviders",
  //     populate: {
  //       path: "author",
  //     },
  //   })
  //   .populate("author");
  // if (!category) {
  //   req.flash("error", "Cannot find that service!");
  //   return res.redirect("/pets");
  // }

  res.render("services/show", {
    category,
  });
};
// This should be correct
module.exports.addNewService = async (req, res) => {
  //const category = await Category.findById(req.params.id);
  //const category = await Category.findById(req.body.serviceType);

  const category = await Category.findOne({ name: req.body.serviceType });
  // if (category) {
  //   const categoryId = category._id;
  //   console.log("Category ID:", categoryId);
  // } else {
  //   console.log("Category not found");
  // }
  // const category = await Category.find({ name: req.body.serviceType });
  //console.log("cat", category);
  const socialMediaProcessed = [];
  const socialMediaUnprocessed = req.body.socialMedia;
  if (socialMediaUnprocessed.facebook.length > 0) {
    socialMediaProcessed.push(socialMediaUnprocessed.facebook[0]);
  } else {
    socialMediaProcessed.push("-");
  }

  if (socialMediaUnprocessed.instagram.length > 0) {
    socialMediaProcessed.push(socialMediaUnprocessed.instagram[0]);
  } else {
    socialMediaProcessed.push("-");
  }

  if (socialMediaUnprocessed.linkedin.length > 0) {
    socialMediaProcessed.push(socialMediaUnprocessed.linkedin[0]);
  } else {
    socialMediaProcessed.push("-");
  }

  if (socialMediaUnprocessed.twitter.length > 0) {
    socialMediaProcessed.push(socialMediaUnprocessed.twitter[0]);
  } else {
    socialMediaProcessed.push("-");
  }

  const unprocessedBody = {
    name: req.body.name,
    serviceType: req.body.serviceType,
    website: req.body.website,
    phone: req.body.phone,
    email: req.body.email,
    description: req.body.description,
    socialMedia: socialMediaProcessed,
  };

  console.log("unp", unprocessedBody);
  const serviceProvider = new ServiceProvider(unprocessedBody);
  //console.log("servp", serviceProvider);
  serviceProvider.author = req.user._id;
  category.serviceProviders.push(serviceProvider);
  await serviceProvider.save();
  await category.save();
  req.flash("success", "Successfully added new service!");
  res.redirect(`/services`);
};

// module.exports.addNewService = async (req, res, next) => {
//   const unprocessedBody = {
//     name: req.body.name,
//     serviceType: req.body.serviceType,
//   };

//   const serviceProvider = new ServiceProvider(unprocessedBody);

//   serviceProvider.author = req.user._id;

//   serviceProvider.save(); // await is needed? and next
//   console.log(serviceProvider);
//   req.flash("success", "Successfully added new service");
//   //res.redirect(`/services/${pet._id}`);
//   res.redirect(`/services`);
// };

// module.exports.createReview = async (req, res) => {
//   const pet = await Pet.findById(req.params.id);
//   const review = new Review(req.body.review);

//   review.author = req.user._id;
//   pet.reviews.push(review);
//   await review.save();
//   await pet.save();
//   req.flash("success", "Created new review!");
//   res.redirect(`/pets/${pet._id}`);
// };
