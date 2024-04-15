import { Client } from "@notionhq/client";
import { DeleteBlockResponse } from "@notionhq/client/build/src/api-endpoints.js";
import { Place } from "../types/type.js";

export default class Notion {
  client: Client;
  databaseID: string;

  constructor() {
    this.client = new Client({ auth: Bun.env.TOKEN_NOTION });
    this.databaseID = Bun.env.DATABASE_NOTION!;
  }

  clearDatabase = async () => {
    const { results } = await this.client.databases.query({
      database_id: this.databaseID,
    });

    const requests: Array<Promise<DeleteBlockResponse>> = [];

    for (const result of results) {
      requests.push(
        this.client.blocks.delete({
          block_id: result.id,
        })
      );
    }

    await Promise.all(requests);

    return results.length;
  };

  addRow = async (place: any) => {
    try {
      await this.client.pages.create({
        parent: { database_id: this.databaseID },
        properties: {
          Addresse: {
            title: [
              {
                text: {
                  content: place.addresse,
                },
              },
            ],
          },
          Name: {
            rich_text: [
              {
                text: {
                  content: place.name,
                },
              },
            ],
          },
          Longitude: {
            number: place.longitude,
          },
          Lattitude: {
            number: place.lattitude,
          },
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  addRows = async (places: Array<any>) => {
    const requests: Array<Promise<void>> = [];

    for (const place of places) {
      requests.push(this.addRow(place));
    }

    await Promise.all(requests);

    return places.length;
  };
}

/* const getPage = async () => {
  const blockID = "2482aae5788945fa9171282f25000b96";

  const response = await notion.blocks.retrieve({ block_id: blockID });
  console.log(response);
};

await getPage(); */
https://www.google.com/maps/place/Silva+Beauty/@47.4023181,0.6810877,17z/data=!3m1?entry=ttu