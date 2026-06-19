import { NextResponse } from 'next/server';

/**
 * OSIRIS / CERES — Agricultural Telemetry API (Agro Events)
 * Provides geolocated datasets for Coop Meetings, Agricultural Fairs, and Transport unrest.
 */
export async function GET() {
  const meetings = [
    {
      id: 'meeting-1',
      name: 'Central Coop Price Review',
      type: 'Cooperative Meeting',
      organizer: 'Midwest Grain Alliance',
      lat: 41.8781,
      lng: -87.6298, // Chicago, IL (near grain exchange)
      date: '2026-06-21T10:00:00Z',
      topic: 'Corn and Wheat futures minimum guarantee review for Autumn harvest.',
      attendees: 120,
    },
    {
      id: 'meeting-2',
      name: 'Organic Mandi Co-op Summit',
      type: 'Cooperative Meeting',
      organizer: 'Punjab Organic Farmers Association',
      lat: 30.9010,
      lng: 75.8573, // Ludhiana, Punjab, India
      date: '2026-06-23T08:30:00Z',
      topic: 'Direct-to-consumer digital portal setup & fertilizer price controls.',
      attendees: 350,
    },
    {
      id: 'meeting-3',
      name: 'Sustainable Irrigation workshop',
      type: 'Training Seminar',
      organizer: 'Ceres Spain Extension Service',
      lat: 37.3891,
      lng: -5.9845, // Seville, Spain
      date: '2026-06-25T15:00:00Z',
      topic: 'Drip irrigation subsidies & water quota management.',
      attendees: 80,
    },
    {
      id: 'meeting-4',
      name: 'AgroTech Seed Swap & Panel',
      type: 'Cooperative Meeting',
      organizer: 'Central Valley Growers Union',
      lat: 36.7783,
      lng: -119.4179, // Fresno, California
      date: '2026-06-28T09:00:00Z',
      topic: 'Drought-resistant seed variants exchange and distribution.',
      attendees: 210,
    }
  ];

  const fairs = [
    {
      id: 'fair-1',
      name: 'Midwest Agricultural Exposition',
      type: 'Agricultural Fair & Expo',
      location: 'Iowa State Fairgrounds',
      lat: 41.5910,
      lng: -93.6037, // Des Moines, IA
      dates: 'June 24-27, 2026',
      highlights: 'Next-gen autonomous tractors, soil sensors, grain storage systems, and seed genetics show.',
      url: 'https://www.iowastatefair.org',
    },
    {
      id: 'fair-2',
      name: 'EuroTier Agro Machinery Expo',
      type: 'Exhibition',
      location: 'Hannover Fairground',
      lat: 52.3759,
      lng: 9.7320, // Hannover, Germany
      dates: 'July 02-05, 2026',
      highlights: 'Precision farming telemetry, livestock housing innovations, and bioenergy solutions.',
      url: 'https://www.eurotier.com',
    },
    {
      id: 'fair-3',
      name: 'Kisan Agri Fair 2026',
      type: 'Exhibition',
      location: 'Pune Exhibition Center',
      lat: 18.5204,
      lng: 73.8567, // Pune, Maharashtra, India
      dates: 'June 29 - July 03, 2026',
      highlights: 'Solar water pumps, drone spraying equipment, micro-fertilizers, and crop insurance stalls.',
      url: 'https://kisan.in',
    }
  ];

  const unrest = [
    {
      id: 'unrest-1',
      name: 'Highway 10 Tractor Blockade',
      type: 'Logistics Protest',
      severity: 'HIGH',
      lat: 48.5260,
      lng: 2.2530, // Paris outer ring, France
      description: 'Farmers protesting diesel fuel taxes have blockaded major logistics route with 80+ tractors.',
      status: 'Active',
      impact: 'Food supply shipments delayed by 4-6 hours entering Paris region.'
    },
    {
      id: 'unrest-2',
      name: 'Grain Elevator Road Block',
      type: 'Labor Strike',
      severity: 'ELEVATED',
      lat: 49.8951,
      lng: -97.1384, // Winnipeg, Manitoba, Canada
      description: 'Rail siding blockade by local agricultural workers union over transit rates.',
      status: 'Active',
      impact: 'Grain rail shipment loadings on standby.'
    },
    {
      id: 'unrest-3',
      name: 'Fertilizer Import Terminal Protest',
      type: 'Protest Checkpoint',
      severity: 'CRITICAL',
      lat: 22.8020,
      lng: 70.1337, // Kandla Port, Gujarat, India
      description: 'Local distributors blockading dock exit over clearance delays of imported urea cargoes.',
      status: 'Active',
      impact: 'Fertilizer distribution trucks stopped from leaving harbor gates.'
    }
  ];

  return NextResponse.json(
    { meetings, fairs, unrest, timestamp: new Date().toISOString() },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
