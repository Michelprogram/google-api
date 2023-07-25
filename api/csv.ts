import { file } from "bun";

export const writeToCSV = (places: Array<any>) => {
  const fileName = "export_place_without_website.csv";
  const csv = file(fileName);
  const writer = csv.writer();

  const header = Object.keys(places[0]).join(",");

  writer.write(header + "\n");

  for (const place of places) {
    const values = Object.values(place)
      .map((value) => {
        if (typeof value === "string") {
          return value.replaceAll(",", "-");
        }
        return value;
      })
      .join(",");

    writer.write(values + "\n");
  }

  writer.end();
};
