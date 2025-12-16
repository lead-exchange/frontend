export interface Entity {
  id: string;
  name: string;
}

export interface LeadRequirements {
  propertyType: 'flat' | 'room' | 'commerce' | 'house' | 'land' | 'garage';
  minPrice: number;
  maxPrice: number;
  minArea: number;
  maxArea: number;
  minKitchenArea?: number;
  maxKitchenArea?: number;
  renovation: 'ANY' | 'NO_RENOVATION' | 'FINISHING' | 'NEEDS_REPAIR' | 'COSMETIC_REPAIR' | 'EURO_REPAIR',
  locations: string[];
  bedrooms?: number | null;
  repairType?: string[];
  marketType?: string[];
  paymentType?: string[];
  features?: string[];
  description?: string;
}

export interface CreateLeadDto {
  name?: string;
  phone?: string;
  requirements: LeadRequirements;
  commissionShare: number;
}

export interface UpdateLeadDto {
  name?: string;
  phone?: string;
  requirements: LeadRequirements;
  commissionShare: number;
  description?: string;
}

export interface Lead extends Entity {
  type: 'lead';
  phone?: string;
  requirements: LeadRequirements;
  status: 'ACTIVE' | 'ARCHIVE';
  commissionShare: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EstateAttributes {
  title: string;
  description: string;
  address: EstateAddress;
  realtyType: string;
  areaCommon: number;
  areaKitchen?: number;
  areaLiving?: number;
  areaRoom?: string;
  areaLand?: number;
  areaLandType?: number;
  builtYear?: string;
  floor?: number;
  floors?: number;
  rooms?: number;
  roofHeight?: number;
  price: number;
  pricePerMeter?: number;
  photos?: string[];
}

interface EstateAddress {
  coordinates?: string;
  regionName?: string;
  regionType?: string;
  countyName?: object;
  cityName?: object;
  placeName?: object;
  placeType?: object;
  streetName?: object;
  streetType?: object;
  house?: string;
  corpus?: object;
  litera?: object;
  building?: object;
  metro?: object;
  flat?: string;
}

export interface RealEstateObject {
  id: string;
  externalId?: number;
  userId: string;
  attributes: EstateAttributes;
  totalCommissionRate: number;
  commissionShare: number;
  status: 'ACTIVE' | 'ARCHIVE';
  createdAt: string;
  updatedAt: string;
  type: 'object';
}

export type EntityType = 'lead' | 'object';
