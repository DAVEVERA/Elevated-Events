import type { TravelInfo } from '@/types';

interface GeocodeResult {
  lat: number;
  lng: number;
}

export async function geocodeAddress(address: string): Promise<GeocodeResult | null> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey || apiKey === 'placeholder') {
    console.log('[Geo Mock] Would geocode:', address);
    return { lat: 52.0907, lng: 5.1214 };
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
    );
    const data = await response.json();

    if (data.results?.[0]?.geometry?.location) {
      const { lat, lng } = data.results[0].geometry.location;
      return { lat, lng };
    }
    return null;
  } catch {
    return null;
  }
}

export async function calculateTravelTime(
  originLat: number,
  originLng: number,
  destLat: number,
  destLng: number
): Promise<TravelInfo | null> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey || apiKey === 'placeholder') {
    const distKm = haversineDistance(originLat, originLng, destLat, destLng);
    const durationMin = Math.round(distKm * 1.3);
    return {
      distance_meters: Math.round(distKm * 1000),
      duration_seconds: durationMin * 60,
      suggested_buffer_minutes: Math.max(15, Math.round(durationMin * 0.5)),
    };
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originLat},${originLng}&destinations=${destLat},${destLng}&mode=driving&key=${apiKey}`
    );
    const data = await response.json();
    const element = data.rows?.[0]?.elements?.[0];

    if (element?.status === 'OK') {
      const durationMin = Math.round(element.duration.value / 60);
      return {
        distance_meters: element.distance.value,
        duration_seconds: element.duration.value,
        suggested_buffer_minutes: Math.max(15, Math.round(durationMin * 0.5)),
      };
    }
    return null;
  } catch {
    return null;
  }
}

function haversineDistance(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}
