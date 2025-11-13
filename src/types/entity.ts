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

export class LeadClass implements Lead {
  type = 'lead' as const;
  id: string;
  name: string;
  userId: string;
  requirements: LeadRequirements;
  status: 'ACTIVE' | 'ARCHIVE';
  commissionShare: number;
  description?: string;
  createdAt: string;
  updatedAt: string;

  constructor(data: Lead) {
    this.id = data.id;
    this.name = data.name;
    this.userId = data.userId;
    this.requirements = data.requirements;
    this.status = data.status;
    this.commissionShare = data.commissionShare;
    this.description = data.description;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  displayName(): string {
    const { propertyType, locations, minPrice, maxPrice } = this.requirements;
    const locationStr = locations.length > 0 ? locations.join(', ') : 'Any location';
    const priceRange = `${minPrice.toLocaleString()}-${maxPrice.toLocaleString()}`;
    return `${propertyType} in ${locationStr} (${priceRange})`;
  }
}

export class RealEstateObjectClass implements RealEstateObject {
  type = 'object' as const;
  id: string;
  name: string;
  userId: string;
  attributes: EstateAttributes;
  totalCommissionRate: number;
  commissionShare: number;
  status: 'ACTIVE' | 'ARCHIVE';
  createdAt: string;
  updatedAt: string;

  constructor(data: RealEstateObject) {
    this.id = data.id;
    this.name = data.name;
    this.userId = data.userId;
    this.attributes = data.attributes;
    this.totalCommissionRate = data.totalCommissionRate;
    this.commissionShare = data.commissionShare;
    this.status = data.status;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}