import { Document } from "mongodb";
import { Location } from "../types/type.js";
import Mongo from "./mongo.js";
import utils from "../utils/utils.js";

export default class Google {
  count: number;
  url: string;
  token: string;
  mongo: Mongo;

  constructor(token: string, mongo: Mongo) {
    this.count = 0;
    this.url = "";
    this.token = token;
    this.mongo = mongo;
  }

  public setUrl(location: Location, nextToken?: string) {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.longitude},${location.lattitude}&radius=350&type=all&key=${this.token}`;

    this.url = nextToken ? `${url}&pagetoken=${nextToken}` : url;
  }

  findPlaces = async (location: Location, next: string) => {
    while (next !== undefined) {
      await utils.sleep(3000);

      this.setUrl(location, next);

      const request = await fetch(this.url);

      const data: any = await request.json();

      const places = await this.mongo.insertPlaces(data.results);

      this.count += places.length;

      next = data.next_page_token;

      if (next) console.log("Next", next.slice(0, 10));
    }
  };

  addLocation = async (location: Location) => {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.longitude},${location.lattitude}&radius=350&type=all&key=${this.token}`;

    const request = await fetch(url);

    const data: any = await request.json();

    const base = this.count;

    const places = await this.mongo.insertPlaces(data.results);

    this.count += places.length;

    await this.findPlaces(location, data.next_page_token);

    console.log(
      `Pour le point ${(location.longitude, location.lattitude)}, ${
        this.count - base
      } ont été enregistré pour un total de ${this.count} `
    );
  };

  private detailPlace = async (place: Document) => {
    const id = place.place_id;

    //Request
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${id}&key=${this.token}`;

    const request = await fetch(url);

    const data: any = await request.json();

    //Update
    await this.mongo.collection.findOneAndUpdate(
      {
        place_id: id,
      },
      {
        $set: {
          informations: data.result,
        },
      }
    );
  };

  detailPlaces = async (places: Document[]) => {
    const requests: Array<Promise<void>> = [];

    for (const place of places) {
      requests.push(this.detailPlace(place));
    }

    await Promise.all(requests);
  };
}
