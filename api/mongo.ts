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

  getAllTags = async () => {
    const pipeline = [
      {
        $unwind: "$types",
      },
      {
        $group: {
          _id: null,
          res: {
            $addToSet: "$types",
          },
        },
      },
    ];

    return await this.collection.aggregate(pipeline).toArray();
  };

  getPlacesWithoutWebsiteByTags = async () => {
    const pipeline = [
      {
        $match: {
          "informations.website": {
            $exists: false,
          },
          types: {
            $in: [
              "shopping_mall",
              "bar",
              "food",
              "book_store",
              "home_goods_store",
              "convenience_store",
              "library",
              "clothing_store",
              "city_hall",
              "supermarket",
              "restaunrant",
              "beauty_salon",
              "store",
              "shoe_store",
              "jewelry_store",
              "electronics_store",
            ],
          },
          business_status: {
            $not: {
              $eq: "CLOSED_TEMPORARILY",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          "geometry.location": 1,
          name: 1,
          types: 1,
          "informations.formatted_address": 1,
          "informations.international_phone_number": 1,
        },
      },
      {
        $addFields: {
          longitude: "$geometry.location.lng",
          lattitude: "$geometry.location.lat",
          addresse: "$informations.formatted_address",
          phone: "$informations.international_phone_number",
          types: {
            $reduce: {
              input: "$types",
              initialValue: "",
              in: {
                $concat: ["$$value", " ", "$$this"],
              },
            },
          },
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
}

export const getCollection = async (database: string, collection: string) => {
  const client = await MongoClient.connect(
    "mongodb://localhost:27017/?directConnection=true"
  );

  return client.db(database).collection(collection);
};
