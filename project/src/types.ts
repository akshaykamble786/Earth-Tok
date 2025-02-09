export interface Location {
  id: number;
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  description: string;
  imageKey: string;
}