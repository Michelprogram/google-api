import { Collection, Document, MongoClient } from "mongodb";

export default class Mongo {
  collection: Collection<Document>;
  constructor(collection: Collection) {
    this.collection = collection;
  }

  clearDatabase = async () => await this.collection.deleteMany({});

  withOutWebsite = async () => {
    const pipeline = [
      {
        $match: {
          "informations.website": {
            $exists: false,
          },
        },
      },
      {
        $project: {
          informations: 1,
          "geometry.location": 1,
          _id: 0,
        },
      },
      {
        $addFields: {
          address: "$informations.formatted_address",
          name: "$informations.name",
          url: "$informations.url",
          longitude: "$geometry.location.lng",
          lattitude: "$geometry.location.lat",
        },
      },
      {
        $project: {
          informations: 0,
          geometry: 0,
        },
      },
    ];

    return await this.collection.aggregate(pipeline).toArray();
  };

  withOutInformations = async () => {
    const pipeline = [
      {
        $match: {
          informations: {
            $exists: false,
          },
        },
      },
    ];

    return await this.collection.aggregate(pipeline).toArray();
  };

  getIds = async () => {
    const ids = await this.collection
      .find(
        {},
        {
          projection: {
            place_id: 1,
            _id: 0,
          },
        }
      )
      .toArray();

    return ids.map((id) => id.place_id);
  };

  insertPlaces = async (data: Array<any>) => {
    const ids = await this.getIds();

    const places: Array<any> = data.filter(
      (place: any) => ids.indexOf(place.place_id) === -1
    );

    if (places.length > 0) await this.collection.insertMany(places);

    return places;
  };
}

export const getCollection = async (database: string, collection: string) => {
  const client = await MongoClient.connect(
    "mongodb://localhost:27017/?directConnection=true"
  );

  return client.db(database).collection(collection);
};
