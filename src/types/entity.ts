export interface Entity {
  id: string;
  name: string;
}

export interface LeadRequirements {
  propertyType: 'apartment' | 'house' | 'commercial';
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

export interface Lead extends Entity {
  type: 'lead';
  userId: string;
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
