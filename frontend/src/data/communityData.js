/**
 * GlobeTrotter Community Mock Data Structure
 * Structured as per Screen 10 specifications (Section 16).
 */

export const POST_TYPES = {
  TRIP: 'trip',
  ACTIVITY: 'activity',
  TIP: 'tip',
  ITINERARY: 'itinerary',
};

export const INITIAL_COMMUNITY_POSTS = [
  {
    id: 'post-1',
    type: 'trip',
    title: 'Amazing 5-Day Goa Adventure & Beach Trails',
    destination: 'Goa, India',
    city: 'Goa',
    country: 'India',
    description: 'Explored Portuguese style fortresses in Panaji, went scuba diving at Grand Island, and enjoyed sunset catamaran cruises in South Goa. Unforgettable 5 days!',
    duration: '5 Days',
    destinationsCount: 4,
    cost: '₹18,500',
    tripId: 'trip-goa',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    author: {
      id: 'usr-101',
      name: 'Jay Sohaliya',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
      location: 'Ahmedabad, India',
    },
    createdAt: '2 days ago',
    likes: 24,
    isLiked: false,
    commentsCount: 8,
    views: 142,
    comments: [
      { id: 'c1', author: 'Priya Sharma', text: 'Loved the scuba diving details! Which dive center did you choose?', time: '1 day ago' },
      { id: 'c2', author: 'Jay Sohaliya', text: 'We used the Grand Island Dive Center near Sinquerim jetty. Highly recommended!', time: '1 day ago' },
      { id: 'c3', author: 'Rohan Mehta', text: 'Great itinerary! Adding Fort Aguada to my Goa trip next month.', time: '18 hours ago' },
    ],
  },
  {
    id: 'post-2',
    type: 'activity',
    title: 'Scuba Diving at Grand Island: Clear Waters & Reef Life',
    destination: 'Goa, India',
    city: 'Goa',
    country: 'India',
    description: 'If you are visiting North Goa, do not miss the morning underwater scuba session at Grand Island. Saw parrotfish, sea turtles, and coral formations.',
    category: 'Adventure & Nature',
    cost: '₹2,500',
    tripId: 'trip-goa',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    author: {
      id: 'usr-102',
      name: 'Ananya Patel',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
      location: 'Mumbai, India',
    },
    createdAt: '4 days ago',
    likes: 42,
    isLiked: true,
    commentsCount: 12,
    views: 280,
    comments: [
      { id: 'c4', author: 'Vikram Singh', text: 'Is non-swimmer diving safe here?', time: '3 days ago' },
      { id: 'c5', author: 'Ananya Patel', text: 'Yes! Instructors stay with you 1-on-1 underwater.', time: '2 days ago' },
    ],
  },
  {
    id: 'post-3',
    type: 'itinerary',
    title: '14-Day European Classical Capitals Trail (Paris, Rome, Barcelona)',
    destination: 'Western Europe',
    city: 'Paris & Rome',
    country: 'France / Italy',
    description: 'Comprehensive 2-week itinerary connecting Western Europe high-speed rail lines, Louvre Renaissance tours, Colosseum arena floor walks, and Catalan gastronomy.',
    duration: '14 Days',
    destinationsCount: 3,
    cost: '₹3,50,000',
    tripId: 'trip-europe',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    author: {
      id: 'usr-103',
      name: 'Alex Morgan',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      location: 'London, UK',
    },
    createdAt: '1 week ago',
    likes: 68,
    isLiked: false,
    commentsCount: 15,
    views: 512,
    comments: [
      { id: 'c6', author: 'Elena Rostova', text: 'Taking Eurail train between Paris and Barcelona was such a scenic choice!', time: '5 days ago' },
    ],
  },
];

export const POPULAR_COMMUNITY_DESTINATIONS = [
  { name: 'Goa', country: 'India', postsCount: 142, image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=300&q=80' },
  { name: 'Paris', country: 'France', postsCount: 98, image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=300&q=80' },
  { name: 'Jaipur', country: 'India', postsCount: 76, image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=300&q=80' },
  { name: 'Kyoto', country: 'Japan', postsCount: 114, image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=300&q=80' },
  { name: 'Rome', country: 'Italy', postsCount: 85, image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=300&q=80' },
];

export const TRENDING_EXPERIENCES = [
  { id: 'tr-1', title: 'Grand Island Scuba Diving & Marine Reefs', likes: 142, destination: 'Goa' },
  { id: 'tr-2', title: 'Louvre Masterpiece Sunset Tour', likes: 98, destination: 'Paris' },
  { id: 'tr-3', title: 'Dudhsagar Waterfalls Jeep Safari', likes: 88, destination: 'Goa' },
  { id: 'tr-4', title: 'Fushimi Inari Torii Gate Sunrise Hike', likes: 112, destination: 'Kyoto' },
];
