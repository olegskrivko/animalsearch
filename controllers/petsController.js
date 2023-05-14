const Pet = require("../models/pet");
const { ObjectId } = require("mongoose").Types;
const { cloudinary } = require("../cloudinary");
const tt = require("@tomtom-international/web-sdk-services/dist/services-node.min.js");
const fns = require("date-fns");
const PDFDocument = require("pdfkit");
const pdfService = require("../pdf-service");
const fs = require("fs");

module.exports.index = async (req, res) => {
  //let userCoordinates = [24.105078, 56.946285];
  //let maxDistance = 10000;
  //const longitude = 24.105078; //
  //const latitude = 56.946285; //

  const ITEMS_PER_PAGE = 10; // Number of items to display per page
  const {
    page,
    limit,
    age,
    gender,
    breed,
    species,
    pattern,
    coat,
    size,
    petStatus,
    identifier,
    name,
    location,
    color,
    lostdate,
    maxDistance,
    userlongitude,
    userlatitude,
  } = req.query;
  //console.log(userlongitude, userlatitude, maxDistance);
  // Validate and sanitize input parameters
  const currentPage = parseInt(page) || 1;
  const limitPerPage = parseInt(limit) || ITEMS_PER_PAGE;

  // Define filter options for the search query
  const filterOptions = {};
  if (age) {
    filterOptions.age = { $regex: new RegExp(age, "i") };
  }
  if (species) {
    filterOptions.species = { $regex: new RegExp(species, "i") };
  }
  if (breed) {
    filterOptions.breed = { $regex: new RegExp(breed, "i") };
  }
  if (pattern) {
    filterOptions.pattern = { $regex: new RegExp(pattern, "i") };
  }
  if (coat) {
    filterOptions.coat = { $regex: new RegExp(coat, "i") };
  }
  if (size) {
    filterOptions.size = { $regex: new RegExp(size, "i") };
  }
  if (petStatus) {
    filterOptions.petStatus = { $regex: new RegExp(petStatus, "i") };
  }
  if (identifier) {
    filterOptions.identifier = { $eq: parseInt(identifier) };
  }
  if (name) {
    filterOptions.name = { $regex: new RegExp(name, "i") };
  }
  if (gender) {
    filterOptions.gender = { $regex: new RegExp(gender, "i") };
  }
  if (lostdate) {
    filterOptions.lostdate = { $gte: new Date(lostdate) };
  }
  if (userlongitude && userlatitude && maxDistance) {
    filterOptions.location = {
      $geoWithin: {
        $centerSphere: [[userlongitude, userlatitude], maxDistance / 6371], // Divide maxDistance by the radius of the Earth in kilometers (6371)
      },
    };
  }

  // later make that it checks in first, second and third color. so need to save colors in one field as array
  if (color) {
    filterOptions.color = { $regex: new RegExp(color, "i") };
  }

  // Retrieve total number of pets for pagination logic
  const totalPets = await Pet.countDocuments(filterOptions);

  // Calculate starting index based on current page and limit
  const startIndex = (currentPage - 1) * limitPerPage;

  // Retrieve pets for current page with applied filter options
  const pets = await Pet.find(filterOptions)
    .skip(startIndex)
    .limit(limitPerPage);

  // Calculate total number of pages based on total pets and limit per page
  const totalPages = Math.ceil(totalPets / limitPerPage);
  // Render response with pagination data
  res.render("pets/index", {
    pets,
    currentPage,
    limitPerPage,
    totalPets,
    totalPages,
    age,
    gender,
    breed,
    species,
    pattern,
    coat,
    size,
    petStatus,
    identifier,
    name,
    location,
    color,
    lostdate,
  });
};

// module.exports.index = async (req, res) => {
//   const { page = 1, limit = 10 } = req.query;
//   // if (!page) page = 1;
//   // if (!limit) limit = 3;
//   // const skip = (page - 1) * 10;

//   try {
//     // execute query with page and limit values
//     const pets = await Pet.find()
//       .limit(limit * 1)
//       .skip((page - 1) * limit)
//       // .find({ color: color })
//       .exec();

//     // get total documents in the Pet collection
//     const count = await Pet.countDocuments();
//     // return response with pets, total pages, and current page
//     const result = {
//       pets,
//       totalPages: Math.ceil(count / limit),
//       currentPage: parseInt(page),
//     };
//     console.log(result);
//     // res.json({ result });
//     res.render("pets/index", {
//       pets,
//       totalPages: result.totalPages,
//       currentPage: result.currentPage,
//       limitPerPage: limit,
//     });
//   } catch (err) {
//     console.error(err.message);
//   }
// };

// module.exports.index = async (req, res) => {
//   let userCoordinates = [24.105078, 56.946285];
//   let maxDistance = 1000;
//   const latitude = 40.7128; // Example latitude
//   const longitude = -74.006; // Example longitude

//   const ITEMS_PER_PAGE = 4; // Number of items to display per page
//   const {
//     page,
//     limit,
//     age,
//     gender,
//     breed,
//     species,
//     pattern,
//     coat,
//     size,
//     petStatus,
//     identifier,
//     name,
//     location,
//     color,
//     firstcolor,
//     lostdate,
//   } = req.query;

//   // Validate and sanitize input parameters
//   const currentPage = parseInt(page) || 1;
//   const limitPerPage = parseInt(limit) || ITEMS_PER_PAGE;

//   // Define filter options for the search query
//   const filterOptions = {};
//   if (age) {
//     filterOptions.age = { $regex: new RegExp(age, "i") }; // Filter by title containing the search value (case-insensitive)
//   }
//   if (species) {
//     filterOptions.species = { $regex: new RegExp(species, "i") }; // Filter by title containing the search value (case-insensitive)
//   }
//   if (breed) {
//     filterOptions.breed = { $regex: new RegExp(breed, "i") }; // Filter by title containing the search value (case-insensitive)
//   }
//   if (pattern) {
//     filterOptions.pattern = { $regex: new RegExp(pattern, "i") }; // Filter by title containing the search value (case-insensitive)
//   }
//   if (coat) {
//     filterOptions.coat = { $regex: new RegExp(coat, "i") }; // Filter by title containing the search value (case-insensitive)
//   }
//   if (size) {
//     filterOptions.size = { $regex: new RegExp(size, "i") }; // Filter by title containing the search value (case-insensitive)
//   }
//   if (petStatus) {
//     filterOptions.petStatus = { $regex: new RegExp(petStatus, "i") }; // Filter by title containing the search value (case-insensitive)
//   }
//   if (identifier) {
//     filterOptions.identifier = { $eq: parseInt(identifier) }; // Filter by cooking time less than the provided value
//   }
//   if (name) {
//     filterOptions.name = { $regex: new RegExp(name, "i") }; // Filter by title containing the search value (case-insensitive)
//   }
//   // if (location) {
//   //   filterOptions.location = { $regex: new RegExp(location, "i") }; // Filter by title containing the search value (case-insensitive)
//   // }
//   if (gender) {
//     filterOptions.gender = { $regex: new RegExp(gender, "i") }; // Filter by title containing the search value (case-insensitive)
//   }
//   if (lostdate) {
//     filterOptions.lostdate = { $gte: new Date(lostdate) }; // Filter by date greater than or equal to the provided date
//   }
//   // if (userCoordinates && maxDistance) {
//   //   filterOptions.location = {
//   //     $near: {
//   //       $geometry: {
//   //         type: "Point",
//   //         coordinates: [longitude, latitude], // MongoDB expects coordinates in [longitude, latitude] format
//   //       },
//   //       $maxDistance: 1000, // Convert miles to meters (1 mile = 1609.34 meters)
//   //     },
//   //   };
//   // }

//   // later make that it checks in first, second and third color. so need to save colors in one field as array
//   if (color) {
//     filterOptions.color = { $regex: new RegExp(color, "i") }; // Filter by title containing the search value (case-insensitive)
//   }

//   // Retrieve total number of recipes for pagination logic
//   const totalPets = await Pet.countDocuments(filterOptions);

//   // Calculate starting index based on current page and limit
//   const startIndex = (currentPage - 1) * limitPerPage;

//   // Retrieve recipes for current page with applied filter options
//   const pets = await Pet.find(filterOptions)
//     .skip(startIndex)
//     .limit(limitPerPage);

//   // Calculate total number of pages based on total recipes and limit per page
//   const totalPages = Math.ceil(totalPets / limitPerPage);

//   // Render response with pagination data
//   res.render("pets/index", {
//     pets,
//     currentPage,
//     limitPerPage,
//     totalPets,
//     totalPages,
//     age,
//     gender,
//     breed,
//     species,
//     pattern,
//     coat,
//     size,
//     petStatus,
//     identifier,
//     name,
//     location,
//     color,
//     lostdate,
//   });
// };

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

  //const { latitude, longitude } = req.body;
  let colorsFormated = [];
  if (req.body.pet.firstcolor) {
    colorsFormated.push(req.body.pet.firstcolor);
  }
  if (req.body.pet.secondcolor) {
    colorsFormated.push(req.body.pet.secondcolor);
  }
  if (req.body.pet.thirdcolor) {
    colorsFormated.push(req.body.pet.thirdcolor);
  }

  let imagesFormated = [];
  imagesFormated = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));

  console.log(colorsFormated);
  const unprocessedBody = {
    species: req.body.pet.species,
    breed: req.body.pet.breed,
    title: req.body.pet.title,
    identifier: req.body.pet.identifier,
    gender: req.body.pet.gender,
    location: {
      type: "Point",
      coordinates: [
        parseFloat(req.body.pet.longitude),
        parseFloat(req.body.pet.latitude),
      ],
    },

    latitude: parseFloat(req.body.pet.latitude),
    longitude: parseFloat(req.body.pet.longitude),

    pattern: req.body.pet.pattern,
    color: colorsFormated,
    coat: req.body.pet.coat,
    size: req.body.pet.size,
    age: req.body.pet.age,
    petStatus: req.body.pet.petStatus,
    lostdate: req.body.pet.lostdate,
    description: req.body.pet.description,
  };
  // console.log(unprocessedBody.title);
  // console.log(unprocessedBody.latitude);
  //console.log("unprocesed", unprocessedBody);
  // const resul = req.body.pet;

  //console.log(pet);

  //const pet = new Pet(req.body.pet);
  const pet = new Pet(unprocessedBody);

  // pet.geometry = coords.features[0].geometry;
  pet.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));

  pet.author = req.user._id;

  pet.save(); // await is needed? and next
  console.log(pet);
  req.flash("success", "Successfully made a new pet");
  res.redirect(`/pets/${pet._id}`);
  //console.log(pet);
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
  //console.log(pet);

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
  Owner: ${pet.owner}
  Species: ${pet.species} 
  Breed: ${pet.breed}
  Pattern: ${pet.pattern}
  Age: ${pet.age}
  Coat: ${pet.coat}
  Size: ${pet.size}
  Status: ${pet.petStatus}
  
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
