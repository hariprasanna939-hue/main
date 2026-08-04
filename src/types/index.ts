export interface Tour {
  id: string;
  title: string;
  slug: string;
  description: string;
  duration: string; // e.g. "8 Days / 7 Nights"
  price: number;
  startLocation: string;
  image: string;
  featured: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  highlights: string[];
  included: string[];
  route: string[]; // e.g. ["Delhi", "Colombo", "Kandy", "Galle"]
}

export interface Booking {
  id: string;
  tourId: string;
  tourTitle: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  travelDate: string;
  guests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface DashboardStats {
  totalRevenue: number;
  activeBookingsCount: number;
  totalToursCount: number;
  pendingBookingsCount: number;
}
