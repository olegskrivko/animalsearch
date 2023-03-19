const Pet = require("../models/pet");
const { cloudinary } = require("../cloudinary");
const tt = require("@tomtom-international/web-sdk-services/dist/services-node.min.js");
const fns = require("date-fns");
const PDFDocument = require("pdfkit");
const pdfService = require("../pdf-service");
const fs = require("fs");

module.exports.index = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  // if (!page) page = 1;
  // if (!limit) limit = 3;
  // const skip = (page - 1) * 10;
  console.log(page, limit);

  try {
    // execute query with page and limit values
    const pets = await Pet.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      // .find({ color: color })
      .exec();

    // get total documents in the Pet collection
    const count = await Pet.countDocuments();
    // return response with pets, total pages, and current page
    const result = {
      pets,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
    };
    // res.json({ result });
    res.render("pets/index", {
      pets,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
    });
  } catch (err) {
    console.error(err.message);
  }
};

module.exports.renderNewForm = (req, res) => {
  res.render("pets/new");
};

module.exports.renderMissingForm = (req, res) => {
  res.render("pets/missing");
};

module.exports.renderFoundForm = (req, res) => {
  res.render("pets/found");
};

module.exports.createPet = async (req, res, next) => {
  // tt.services
  // .geocode({
  //   key: process.env.TOMTOM_API_KEY,
  //   query: req.body.pet.location,
  //   limit: 1,
  // })
  // .then(function (geoResult) {
  // const coords = geoResult.toGeoJson();
  const pet = new Pet(req.body.pet);
  // pet.geometry = coords.features[0].geometry;
  pet.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  pet.author = req.user._id;

  pet.save(); // await is needed? and next
  req.flash("success", "Successfully made a new pet");
  res.redirect(`/pets/${pet._id}`);
  // })
  // .catch(function (reason) {
  //   console.log("Copyrights", reason);
  // });
};

module.exports.showPet = async (req, res) => {
  const pet = await Pet.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!pet) {
    req.flash("error", "Cannot find that pet!");
    return res.redirect("/pets");
  }
  // console.log(
  //   fns.formatDistanceToNow(new Date(pet.createdAt), { addSuffix: true })
  // );
  console.log(pet);

  const createDateInWords = fns.formatDistanceToNow(new Date(pet.createdAt), {
    addSuffix: true,
  });
  const updateDateInWords = fns.formatDistanceToNow(new Date(pet.updatedAt), {
    addSuffix: true,
  });

  const lostDateInWords = fns.formatDistanceToNow(new Date(pet.lostdate), {
    addSuffix: true,
  });
  // console.log(lostDateInWords);

  // console.log(fns.formatRelative(new Date(pet.createdAt), new Date()));
  // console.log(fns.formatRelative(new Date(pet.updatedAt), new Date()));
  // console.log(fns.formatRelative(fns.subDays(new Date(), 5), new Date()));
  // console.log(fns.format(new Date(), "'Today is a' eeee"));
  // console.log(fns.format(new Date(), "'Today is a' eeee"));

  res.render("pets/show", {
    pet: pet,
    createDateInWords,
    updateDateInWords,
    lostDateInWords,
  });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const pet = await Pet.findById(id);
  if (!pet) {
    req.flash("error", "Cannot find that pet!");
    return res.redirect("/pets");
  }
  res.render("pets/edit", { pet });
};

module.exports.updatePet = async (req, res) => {
  const { id } = req.params;
  const pet = await Pet.findByIdAndUpdate(id, {
    ...req.body.pet,
  });
  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  pet.images.push(...imgs);
  await pet.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await pet.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash("success", "Successfully updated pet!");
  res.redirect(`/pets/${pet._id}`);
};

module.exports.deletePet = async (req, res) => {
  const { id } = req.params;
  await Pet.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted pet");
  res.redirect("/pets");
};

module.exports.renderPdf = async (req, res) => {
  const { id } = req.params;
  const pet = await Pet.findById(id);
  // console.log(pet);
  // const outputData = pet;
  const myTemplate = `
  Name: ${pet.title}
  Last seen in: ${pet.location}
  Owner: ${pet.owner}
  Species: ${pet.species} 
  Breed: ${pet.breed}
  Pattern: ${pet.pattern}
  First color: ${pet.firstcolor}
  Second color: ${pet.secondcolor}
  Third color: ${pet.thirdcolor}
  Lost: ${pet.lostDateInWords}
  Age: ${pet.age}
  Coat: ${pet.coat}
  Size: ${pet.size}
  Status: ${pet.status}
  
  Description: ${pet.description}
  `;

  const stream = res.writeHead(200, {
    "Content-Type": "application/pdf",
    "Content-Disposition": "attachment;filename=petinfo.pdf",
  });

  pdfService.buildPDF(
    myTemplate,
    (chunk) => stream.write(chunk),
    () => stream.end()
  );

  // doc.pipe(fs.createWriteStream("output.pdf"));
  // doc.pipe(res);
  // doc
  //   .fontSize(25)
  //   .text(
  //     `Name: ${pet.tile}, Breed: ${pet.breed}, Pattern: ${pet.pattern}, Coat: ${pet.coat}`
  //   );
  // doc.end();
};

// if (!pet) {
//   req.flash("error", "Cannot find that pet!");
//   return res.redirect("/pets");
// }
// res.render("pets/edit", { pet });
// };
