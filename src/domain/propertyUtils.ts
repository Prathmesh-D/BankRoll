import type { Property, EditionConfig } from '../types/edition';
import type { Entity } from '../types/entity';
import type { PropertyId } from '../types/primitives';

/**
 * Retrieves a property by ID from edition config.
 */
export function getPropertyById(
  propertyId: PropertyId,
  config: EditionConfig
): Property | undefined {
  return config.properties.find(p => p.id === propertyId);
}

/**
 * Gets the current rent for a property based on houses built.
 * housesBuilt: 0 = no development, 1-4 = houses, 5 = hotel
 */
export function getCurrentRent(property: Property, housesBuilt: number): number {
  return property.rentTiers.find(t => t.houses === housesBuilt)?.amount ?? 0;
}

/**
 * Gets rent for a station based on how many stations the player owns.
 * stationsOwned: 1-4
 */
export function getStationRent(property: Property, stationsOwned: number): number {
  if (!property.isStation || !property.stationRentTiers) return 0;
  return property.stationRentTiers[Math.min(stationsOwned, 4) - 1] ?? 0;
}

/**
 * Gets all properties belonging to a colour group.
 */
export function getPropertiesByColorGroup(
  groupId: string,
  config: EditionConfig
): Property[] {
  return config.properties.filter(p => p.colorGroup === groupId);
}

/**
 * Checks if a property is mortgaged by a specific entity.
 */
export function isMortgaged(propertyId: PropertyId, entity: Entity | null): boolean {
  if (!entity) return false;
  return entity.mortgagedProperties.includes(propertyId);
}

/**
 * Gets all non-station, non-utility properties (streets only).
 */
export function getStreetProperties(config: EditionConfig): Property[] {
  return config.properties.filter(p => !p.isStation && !p.isUtility);
}

/**
 * Gets all station properties.
 */
export function getStations(config: EditionConfig): Property[] {
  return config.properties.filter(p => p.isStation);
}

/**
 * Gets all utility properties.
 */
export function getUtilities(config: EditionConfig): Property[] {
  return config.properties.filter(p => p.isUtility);
}

/**
 * Searches properties by name (case-insensitive partial match).
 */
export function searchProperties(query: string, config: EditionConfig): Property[] {
  const lower = query.toLowerCase().trim();
  if (!lower) return config.properties;
  return config.properties.filter(p =>
    p.name.toLowerCase().includes(lower) ||
    p.colorGroup.toLowerCase().includes(lower)
  );
}
