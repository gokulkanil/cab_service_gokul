// Values that mirror the database enums (supabase/migrations). Keep them in sync.

export const APP_ROLES = ['customer', 'driver', 'admin'] as const;
export type AppRole = (typeof APP_ROLES)[number];

export const VEHICLE_STATUSES = ['active', 'maintenance', 'retired'] as const;
export type VehicleStatus = (typeof VEHICLE_STATUSES)[number];

export const PLACE_KINDS = ['destination', 'airport', 'railway_station', 'city', 'town'] as const;
export type PlaceKind = (typeof PLACE_KINDS)[number];
