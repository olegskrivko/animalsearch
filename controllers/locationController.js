const Location = require("../models/location");

module.exports.getRegion = async (req, res) => {
  const regionName = req.params.regionName;
  //console.log("reg name", regionName);

  try {
    // Query the database using the regionName and retrieve the GeoJSON data
    const region = await Location.findOne({ region: regionName });

    if (!region) {
      return res.status(404).json({ message: "Region not found" });
    }

    res.json(region.geometry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
//   const { country, region } = req.params;

//   try {
//     const location = await Location.findOne({ country, region });

//     if (!location) {
//       return res.status(404).json({ message: "Region not found" });
//     }

//     res.json(location);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// app.get("/regions/:regionName", async (req, res) => {
//   const { regionName } = req.params;

//   try {
//     // Query the database using the regionName and retrieve the GeoJSON data
//     const region = await Region.findOne({ name: regionName });

//     if (!region) {
//       return res.status(404).json({ message: "Region not found" });
//     }

//     res.json(region.geometry);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

module.exports.createRegion = async (req, res) => {
  try {
    const { country, region, geometry } = req.body;

    const location = new Location({
      country,
      region,
      geometry,
    });

    const savedLocation = await location.save();

    res.status(201).json(savedLocation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create region" });
  }
};
