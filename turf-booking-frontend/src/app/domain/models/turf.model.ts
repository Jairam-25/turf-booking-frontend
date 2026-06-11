export interface Turf {
  id: number;
  name: string;
  location: string;
  pricePerHour: number;
  imageUrl?: string;
  rating?: number;
  description?: string;
  latitude?: number;
  longitude?: number;
  dayTimePrice?: number;
  afternoonPrice?: number;
  nightTimePrice?: number;
  state?: string;
  city?: string;
}

export interface TurfResponse {
  items: Turf[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}
