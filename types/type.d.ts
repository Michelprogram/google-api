export type Location = {
  longitude: number;
  lattitude: number;
};

export type Place = {
  address: string;
  name: string;
  coordinate: Location;
};
