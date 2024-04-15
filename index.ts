//Connection mongodb
import Mongo, { getCollection } from "./api/mongo.js";
import Google from "./api/google.js";
import Notion from "./api/notion.js";
import utils from "./utils/utils.js";
import { Document } from "mongodb";
import { writeToCSV } from "./api/csv.js";

//Mongo connection
const collection = await getCollection("google-api", "places");
const mongo = new Mongo(collection);

const main = async () => {
  // For the first case await mongo.clearDatabase();

  console.log("Mongo DB done");
  //Fetch data from API
  const google = new Google(Bun.env.TOKEN_GOOGLE!, mongo);

  for (const location of utils.locations) {
    await google.addLocation(location);
  }

  let places = await mongo.withOutInformations();

  await google.detailPlaces(places);

  //Notion upload
  console.log("Start notion");

  const notion = new Notion();

  await notion.clearDatabase();

  const placesNoWebSite = await mongo.getPlacesWithoutWebsiteByTags();

  await notion.addRows(placesNoWebSite);

  console.log("End notion");

  writeToCSV(placesNoWebSite);
};

//Notion upload
console.log("Start notion");

const notion = new Notion();

await notion.clearDatabase();

const placesNoWebSite = await mongo.getPlacesWithoutWebsiteByTags();

await notion.addRows(placesNoWebSite);

console.log("End notion");

writeToCSV(placesNoWebSite);
