
import { Address } from '../organization/types';

export interface Property {
  id: string;
  name: string;
  address: Address;
  type: 'apartment' | 'house' | 'dormitory' | 'corporate-housing';
  totalUnits: number;
  availableUnits: number;
  amenities: string[];
  images: string[];
  description: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PropertyUnit {
  id: string;
  propertyId: string;
  unitNumber: string;
  type: 'studio' | '1br' | '2br' | '3br' | '4br+';
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  rent: number;
  deposit: number;
  isAvailable: boolean;
  features: string[];
  images: string[];
}
