export type BusinessType =
  | 'farm'
  | 'farmers_market'
  | 'food_business'
  | 'supplier'
  | 'service_provider'
  | 'showcase_project';

export type BusinessCategory =
  | 'produce_farm'
  | 'farmers_market'
  | 'food_vendor'
  | 'hempcrete_supplier'
  | 'greenhouse_builder'
  | 'solar_installer'
  | 'sustainable_building'
  | 'agricultural_services'
  | 'showcase_project';

export type ListingTier = 'basic' | 'featured' | 'premium';

export interface SupplierInfo {
  service_area?: string;
  certifications?: string[];
  min_order?: string;
  lead_time?: string;
  specialties?: string[];
  years_experience?: number;
  pricing_tier?: string;
}

export interface ShowcaseProject {
  is_showcase: boolean;
  project_type?: string;
  design_highlights?: string[];
  budget_range?: string;
  timeline?: string;
  replicable?: boolean;
  open_source?: boolean;
}

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

  // New marketplace fields
  business_type?: BusinessType;
  categories?: BusinessCategory[];
  listing_tier?: ListingTier;
  supplier_info?: SupplierInfo;
  showcase_project?: ShowcaseProject;
  featured?: boolean;
  verified?: boolean;
}

export interface FilterState {
  searchTerm: string;
  snapHip: boolean | null;
  blackOwned: boolean | null;
  ejZone: boolean | null;
  indoorOutdoor: string;
  businessType: BusinessType | 'all';
  category: BusinessCategory | 'all';
  listingTier: ListingTier | 'all';
}
