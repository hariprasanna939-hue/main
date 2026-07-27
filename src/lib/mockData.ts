import { Tour, Booking, DashboardStats } from '../types';

const INITIAL_TOURS: Tour[] = [
  {
    id: '1',
    title: 'Golden Triangle & Cultural Sri Lanka',
    slug: 'golden-triangle-cultural-sri-lanka',
    description: 'Experience the rich history of India\'s Golden Triangle (Delhi, Agra, Jaipur) combined with the majestic temples and pristine beaches of Sri Lanka.',
    duration: '12 Days / 11 Nights',
    price: 1899,
    startLocation: 'Delhi, India',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
    featured: true,
    difficulty: 'medium',
    highlights: ['Visit the iconic Taj Mahal at sunrise', 'Explore Jaipur\'s Amber Fort', 'Climb the Sigiriya Rock Fortress in Sri Lanka', 'Relax on the beaches of Galle'],
    included: ['5-star hotel accommodations', 'Internal flights between India & Sri Lanka', 'Daily breakfast and select dinners', 'Private English-speaking tour guides', 'All monument entry tickets'],
    route: ['New Delhi', 'Agra', 'Jaipur', 'Colombo', 'Sigiriya', 'Kandy', 'Galle']
  },
  {
    id: '2',
    title: 'Kerala Backwaters & Hill Country Escape',
    slug: 'kerala-backwaters-hill-country-escape',
    description: 'A serene journey through the green paradise of Kerala\'s houseboat canals, crossing over to the beautiful tea estates of Nuwara Eliya, Sri Lanka.',
    duration: '9 Days / 8 Nights',
    price: 1450,
    startLocation: 'Kochi, India',
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
    featured: true,
    difficulty: 'easy',
    highlights: ['Overnight houseboat cruise in Alleppey', 'Tea tasting in Nuwara Eliya', 'Spice plantation tour in Thekkady', 'Scenic train ride through Sri Lankan highlands'],
    included: ['Boutique heritage hotel stays', 'Traditional houseboat booking', 'Airport transfers', 'Daily breakfast & lunch', 'Train ticket booking (Nanu Oya to Ella)'],
    route: ['Kochi', 'Alleppey', 'Munnar', 'Colombo', 'Nuwara Eliya', 'Ella']
  },
  {
    id: '3',
    title: 'Wild Coast Explorer: Parks & Safaris',
    slug: 'wild-coast-explorer-parks-safaris',
    description: 'Embark on a thrilling wildlife adventure. Spot tigers in India\'s Ranthambore and leopards in Sri Lanka\'s Yala National Park, alongside pristine coastal views.',
    duration: '10 Days / 9 Nights',
    price: 2199,
    startLocation: 'Jaipur, India',
    image: 'https://images.unsplash.com/photo-1581888227599-779811939961?auto=format&fit=crop&w=800&q=80',
    featured: false,
    difficulty: 'hard',
    highlights: ['Two game drives in Ranthambore NP', 'Leopard safari in Yala National Park', 'Whale watching tour in Mirissa', 'Explore the historic Galle Fort'],
    included: ['All national park fees and permits', '4x4 safari vehicles with naturalist guides', 'Eco-lodge stays', 'All meals included during safaris', 'Whale watching boat ticket'],
    route: ['Jaipur', 'Ranthambore', 'Colombo', 'Yala', 'Mirissa', 'Galle']
  }
];

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'B-1001',
    tourId: '1',
    tourTitle: 'Golden Triangle & Cultural Sri Lanka',
    customerName: 'Alice Johnson',
    customerEmail: 'alice.j@example.com',
    customerPhone: '+1 (555) 019-2834',
    travelDate: '2026-09-15',
    guests: 2,
    totalPrice: 3798,
    status: 'confirmed',
    createdAt: '2026-07-01'
  },
  {
    id: 'B-1002',
    tourId: '2',
    tourTitle: 'Kerala Backwaters & Hill Country Escape',
    customerName: 'Robert Smith',
    customerEmail: 'r.smith@example.com',
    customerPhone: '+44 20 7946 0958',
    travelDate: '2026-10-05',
    guests: 4,
    totalPrice: 5800,
    status: 'pending',
    createdAt: '2026-07-10'
  },
  {
    id: 'B-1003',
    tourId: '1',
    tourTitle: 'Golden Triangle & Cultural Sri Lanka',
    customerName: 'Mei Ling',
    customerEmail: 'meiling@example.com',
    customerPhone: '+86 10 6555 1234',
    travelDate: '2026-08-20',
    guests: 1,
    totalPrice: 1899,
    status: 'cancelled',
    createdAt: '2026-06-25'
  }
];

// Helper to check for window and access localStorage safely
const isClient = typeof window !== 'undefined';

const getStoredData = <T>(key: string, initialData: T): T => {
  if (!isClient) return initialData;
  const stored = localStorage.getItem(key);
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(initialData));
    return initialData;
  }
  try {
    return JSON.parse(stored) as T;
  } catch {
    return initialData;
  }
};

const setStoredData = <T>(key: string, data: T): void => {
  if (isClient) {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

// Tours CRUD
export const getTours = (): Tour[] => {
  return getStoredData<Tour[]>('escape_tours', INITIAL_TOURS);
};

export const getTourBySlug = (slug: string): Tour | undefined => {
  const tours = getTours();
  return tours.find(t => t.slug === slug);
};

export const addTour = (tour: Omit<Tour, 'id' | 'slug'>): Tour => {
  const tours = getTours();
  const slug = tour.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const newTour: Tour = {
    ...tour,
    id: Math.random().toString(36).substring(2, 9),
    slug
  };
  const updated = [...tours, newTour];
  setStoredData('escape_tours', updated);
  return newTour;
};

export const updateTour = (updatedTour: Tour): Tour => {
  const tours = getTours();
  const updated = tours.map(t => t.id === updatedTour.id ? updatedTour : t);
  setStoredData('escape_tours', updated);
  return updatedTour;
};

export const deleteTour = (id: string): void => {
  const tours = getTours();
  const updated = tours.filter(t => t.id !== id);
  setStoredData('escape_tours', updated);
};

// Bookings CRUD
export const getBookings = (): Booking[] => {
  return getStoredData<Booking[]>('escape_bookings', INITIAL_BOOKINGS);
};

export const addBooking = (booking: Omit<Booking, 'id' | 'createdAt' | 'status'>): Booking => {
  const bookings = getBookings();
  const newBooking: Booking = {
    ...booking,
    id: `B-${Math.floor(1000 + Math.random() * 9000)}`,
    status: 'pending',
    createdAt: new Date().toISOString().split('T')[0]
  };
  const updated = [newBooking, ...bookings];
  setStoredData('escape_bookings', updated);
  return newBooking;
};

export const updateBookingStatus = (id: string, status: Booking['status']): Booking | undefined => {
  const bookings = getBookings();
  let updatedBooking: Booking | undefined;
  const updated = bookings.map(b => {
    if (b.id === id) {
      updatedBooking = { ...b, status };
      return updatedBooking;
    }
    return b;
  });
  setStoredData('escape_bookings', updated);
  return updatedBooking;
};

// Stats
export const getDashboardStats = (): DashboardStats => {
  const tours = getTours();
  const bookings = getBookings();
  
  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const activeBookingsCount = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending').length;
  const pendingBookingsCount = bookings.filter(b => b.status === 'pending').length;

  return {
    totalRevenue,
    activeBookingsCount,
    totalToursCount: tours.length,
    pendingBookingsCount
  };
};
