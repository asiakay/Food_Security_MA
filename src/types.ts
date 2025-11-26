export interface Business {
  id: number;
  business_name: string;
  location: string;
  activity: string;
  website: string;
  instagram: string;
  facebook: string;
  phone: string;
  email: string;
  hours: string;
  season: string;
  snap_hip: string;
  vendor_info: string;
  social: string;
  latitude: number | null;
  longitude: number | null;
  black_owned: string;
  indoor_outdoor: string;
  ej_zone: string;
}

export interface FilterState {
  searchTerm: string;
  snapHip: boolean | null;
  blackOwned: boolean | null;
  ejZone: boolean | null;
  indoorOutdoor: string;
}
