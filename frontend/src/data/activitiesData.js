/**
 * Sample Places to Visit & Activity Suggestions for GlobeTrotter Travel Planning
 */

export const ACTIVITY_CATEGORIES = [
  'All',
  'Sightseeing',
  'Culture',
  'Food',
  'Adventure',
  'Relaxation',
];

export const SAMPLE_DESTINATIONS = [
  { id: 'd-1', city: 'Goa', country: 'India', region: 'Asia', tag: 'Coastal & Beaches' },
  { id: 'd-2', city: 'Kyoto', country: 'Japan', region: 'Asia', tag: 'Cultural & Historic' },
  { id: 'd-3', city: 'Paris', country: 'France', region: 'Europe', tag: 'City & Architecture' },
  { id: 'd-4', city: 'Jaipur', country: 'India', region: 'Asia', tag: 'Heritage & Palaces' },
];

export const ACTIVITIES_DATA = [
  {
    id: 'act-1',
    name: 'Scuba Diving at Grand Island',
    city: 'Goa',
    country: 'India',
    category: 'Adventure',
    duration: '4 hours',
    cost: '₹3,500',
    costValue: 3500,
    costNumeric: 3500,
    currency: '₹',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
    description: 'Explore underwater coral reefs and marine life with certified instructors.',
  },
  {
    id: 'act-2',
    name: 'Sunset Cruise on Mandovi River',
    city: 'Goa',
    country: 'India',
    category: 'Sightseeing',
    duration: '1.5 hours',
    cost: '₹800',
    costValue: 800,
    costNumeric: 800,
    currency: '₹',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    description: 'Enjoy live Goan folk music, dance performances, and sunset views.',
  },
  {
    id: 'act-3',
    name: 'Eiffel Tower Summit & Seine River Cruise',
    city: 'Paris',
    country: 'France',
    category: 'Sightseeing',
    duration: '4 hours',
    cost: '₹7,500',
    costValue: 7500,
    costNumeric: 7500,
    currency: '₹',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80',
    description: 'Skip-the-line access to Eiffel Tower summit followed by evening champagne cruise.',
  },
  {
    id: 'act-4',
    name: 'Amer Fort & Jeep Safari',
    city: 'Jaipur',
    country: 'India',
    category: 'Sightseeing',
    duration: '3.5 hours',
    cost: '₹900',
    costValue: 900,
    costNumeric: 900,
    currency: '₹',
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=600&q=80',
    description: 'Explore hilltop palace complex with mirror work chambers and ramparts.',
  },
];

export const SAMPLE_ACTIVITIES = ACTIVITIES_DATA;
