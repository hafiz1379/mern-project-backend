const axios = require("axios");

const HttpError = require("../models/http-error");
 
const API_KEY = process.env.GOOGLE_API_KEY;

async function getCoordsForAddress(address) {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${API_KEY}`
    );

    console.log("Response data:", response.data);

    const data = response.data;

    if (!data || data.status === "ZERO_RESULTS") {
      throw new HttpError(
        "Could not find location for the specified address.",
        422
      );
    }

    const coordinates = data.results[0]?.geometry?.location;

    if (!coordinates) {
      throw new HttpError(
        "Could not extract coordinates from the response data.",
        422
      );
    }

    return coordinates;
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    throw new HttpError(
      "Something went wrong, could not fetch coordinates for the specified address.",
      500
    );
  }
}
module.exports = getCoordsForAddress; // Exporting the function
