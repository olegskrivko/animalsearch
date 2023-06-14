const ServiceProvider = require("../models/serviceProvider");
const Category = require("../models/category");
const { cloudinary } = require("../cloudinary");

const path = require("path");

module.exports.renderAddServiceForm = (req, res) => {
  res.render("services/new");
};

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

  //console.log(category);

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
  //console.log(socialMediaUnprocessed);
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
  const userCoords = req.body.user;
  //console.log(userCoords.latitude);
  //console.log(userCoords.longitude);

  // if (socialMediaUnprocessed.linkedin.length > 0) {
  //   socialMediaProcessed.push(socialMediaUnprocessed.linkedin[0]);
  // } else {
  //   socialMediaProcessed.push("-");
  // }

  // if (socialMediaUnprocessed.twitter.length > 0) {
  //   socialMediaProcessed.push(socialMediaUnprocessed.twitter[0]);
  // } else {
  //   socialMediaProcessed.push("-");
  // }
  const image = req.file;
  //console.log("test image", image);
  const unprocessedBody = {
    name: req.body.name,
    serviceProviderType: req.body.serviceProviderType,
    serviceType: req.body.serviceType,
    website: req.body.website,
    phonecode: req.body.phonecode,
    phone: req.body.phone,
    email: req.body.email,
    location: {
      type: "Point",
      coordinates: [userCoords.longitude, userCoords.latitude],
    },
    description: req.body.description,
    socialMedia: socialMediaProcessed,
  };

  // if (image) {
  //   // this doesnt work, it uploads anyway
  //   //const cloudinaryRes = await cloudinary.uploader.upload(image.path);
  //   const serviceProvider = await ServiceProvider.create({
  //     ...unprocessedBody,
  //     logo: { url: image.path, filename: image.filename },
  //   });

  if (image) {
    const cloudinaryRes = await cloudinary.uploader.upload(image.path);
    const serviceProvider = await ServiceProvider.create({
      ...unprocessedBody,
      logo: { url: cloudinaryRes.url, filename: cloudinaryRes.public_id },
    });

    // const serviceProvider = new ServiceProvider(unprocessedBody);
    // serviceProvider.logo = { url: image.path, filename: image.filename };
    //console.log("servp", serviceProvider);
    serviceProvider.author = req.user._id;
    category.serviceProviders.push(serviceProvider);

    await serviceProvider.save();
    //console.log(serviceProvider);
    await category.save();
    req.flash("success", "Successfully added new service!");
    res.redirect(`/services`);
  }
};

module.exports.updateService = (req, res) => {};
module.exports.deleteService = (req, res) => {};
