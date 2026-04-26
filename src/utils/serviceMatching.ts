/**
 * Service matching utility to match residence services with all services
 * to get the correct service IDs for booking submission
 */

export interface AllService {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface ResidenceService {
  name: string;
  description: string;
  extra_cost: number;
}

export interface MatchedService {
  id: number;
  name: string;
  description: string;
  extra_cost: number;
  service_id: number; // This is the actual service ID we need for booking
}

/**
 * Matches residence services with all services to get correct service IDs
 * @param allServices - List of all available services
 * @param residenceServices - List of services for a specific residence
 * @returns Array of matched services with correct IDs
 */
export const matchServices = (
  allServices: AllService[],
  residenceServices: ResidenceService[]
): MatchedService[] => {
  return residenceServices.map(residenceService => {
    // Find the matching service in all services by name
    const matchedService = allServices.find(
      allService => allService.name === residenceService.name
    );

    if (!matchedService) {
      console.warn(`Service "${residenceService.name}" not found in all services`);
      return {
        id: 0, // Fallback ID
        name: residenceService.name,
        description: residenceService.description,
        extra_cost: residenceService.extra_cost,
        service_id: 0 // Fallback service_id
      };
    }

    return {
      id: matchedService.id, // Use the matched service's ID
      name: residenceService.name,
      description: residenceService.description,
      extra_cost: residenceService.extra_cost,
      service_id: matchedService.id // This is the correct service_id for booking
    };
  });
};

/**
 * Creates a service lookup map for quick access
 * @param allServices - List of all available services
 * @returns Map with service name as key and service ID as value
 */
export const createServiceLookup = (allServices: AllService[]): Map<string, number> => {
  const lookup = new Map<string, number>();
  allServices.forEach(service => {
    lookup.set(service.name, service.id);
  });
  return lookup;
};

/**
 * Gets service ID by name from lookup map
 * @param serviceName - Name of the service
 * @param lookup - Service lookup map
 * @returns Service ID or null if not found
 */
export const getServiceIdByName = (serviceName: string, lookup: Map<string, number>): number | null => {
  return lookup.get(serviceName) || null;
};
