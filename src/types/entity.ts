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
  locations: string[];
  bedrooms?: number | null;
  repairType?: string[];
  marketType?: string[];
  paymentType?: string[];
  features?: string[];
}

export interface CreateLeadDto {
  userId: string;
  name?: string;
  phone?: string;
  requirements: LeadRequirements;
  commissionShare: number;
  description?: string;
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
  userId: string;
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
  address: string;
  price: number;
  area: number;
  bedrooms?: number | null;
  photos?: string[];
  floor?: number;
  totalFloors?: number;
  repairType?: string;
  propertyClass?: string;
  marketType?: string[];
  paymentType?: string[];
}

export interface RealEstateObject extends Entity {
  type: 'object';
  userId: string;
  attributes: EstateAttributes;
  totalCommissionRate: number;
  commissionShare: number;
  status: 'ACTIVE' | 'ARCHIVE';
  createdAt: string;
  updatedAt: string;
}

export type EntityType = 'lead' | 'object';
