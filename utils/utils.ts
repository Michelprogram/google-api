import { Location, Place } from "../types/type.js";
import { file } from "bun";

export default class {
  public static writeToCSV = async (places: Array<Place>) => {
    const csv = file("place_without_website.csv");
    const writer = csv.writer();

    writer.write("Address,Name,Longitude,Lattitude\n");

    for (const place of places) {
      const { address, name, coordinate } = place;

      writer.write(
        `${address.replaceAll(",", " - ")},${name.replaceAll(",", " - ")},${
          coordinate.longitude
        },${coordinate.lattitude}\n`
      );
    }
  };

  public static sleep = (time: number) =>
    new Promise((f) => setTimeout(f, time));

  public static locations: Array<Location> = [
    {
      longitude: 47.399085,
      lattitude: 0.65264,
    },
    {
      longitude: 47.399962,
      lattitude: 0.664014,
    },
    {
      longitude: 47.401472,
      lattitude: 0.674453,
    },
    {
      longitude: 47.402593,
      lattitude: 0.683595,
    },
    {
      longitude: 47.392075,
      lattitude: 0.666518,
    },
    {
      longitude: 47.392994,
      lattitude: 0.672852,
    },
    {
      longitude: 47.395567,
      lattitude: 0.681358,
    },
    {
      longitude: 47.395628,
      lattitude: 0.687693,
    },
    {
      longitude: 47.395751,
      lattitude: 0.692398,
    },
    {
      longitude: 47.394281,
      lattitude: 0.696108,
    },
    {
      longitude: 47.393699,
      lattitude: 0.691131,
    },
    {
      longitude: 47.392412,
      lattitude: 0.685883,
    },
    {
      longitude: 47.391563,
      lattitude: 0.67843,
    },
    {
      longitude: 47.390268,
      lattitude: 0.673669,
    },
    {
      longitude: 47.389067,
      lattitude: 0.691267,
    },
    {
      longitude: 47.39451,
      lattitude: 0.681732,
    },
    {
      longitude: 47.386566,
      lattitude: 0.684836,
    },
    {
      longitude: 47.390191,
      lattitude: 0.688851,
    },
    {
      longitude: 47.392368,
      lattitude: 0.687918,
    },
    {
      longitude: 47.386349,
      lattitude: 0.675268,
    },
  ];
}
