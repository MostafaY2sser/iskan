
export interface Organization {
  id: string;
  name: string;
  type: 'property-management' | 'recruiting-company';
  logo?: string;
  address: Address;
  contactInfo: ContactInfo;
  settings: OrganizationSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  website?: string;
}

export interface OrganizationSettings {
  timezone: string;
  currency: string;
  language: string;
  features: Record<string, boolean>;
}
