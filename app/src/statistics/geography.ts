import worldMap from './worldMap.json';

/** A time zone's city, its region, and where it is drawn (Antarctica's stations are not). */
export interface Place {
  city: string;
  region: string;
  x?: number;
  y?: number;
}

const PLACES: Record<string, Place> = worldMap.places;

/** Where a time zone is: Europe/Paris is Paris, in Europe. */
export function placeOf(timeZone: string): Place {
  return PLACES[timeZone] ?? { city: timeZone, region: timeZone.split('/')[0] };
}

/** What tzdata calls a region, said for people in their language (the messages' statistics.regions). */
export function regionName(region: string, names: Record<string, string>): string {
  return names[region] ?? region;
}
