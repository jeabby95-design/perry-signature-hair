export type UserRole = "admin" | "staff" | "client";

export type BookingStatus =
  | "pending"
  | "quoted"
  | "confirmed"
  | "declined"
  | "completed"
  | "cancelled";

export type HairProvidedOption = "client" | "salon";

export interface AvailabilityDay {
  day: string;
  enabled: boolean;
  start: string;
  end: string;
}

export interface BlockedDate {
  date: string;
  reason: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  role: UserRole;
  points: number;
  status: "active" | "inactive";
  availability?: AvailabilityDay[];
  blockedDates?: BlockedDate[];
  specialties?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  clientId: string;
  clientName: string;
  email: string;
  phone: string;
  service: string;
  stylistId?: string;
  stylistName?: string;
  size?: string;
  length?: string;
  notes?: string;
  imageUrl?: string;
  hairProvided: HairProvidedOption;
  preferredDate: string;
  preferredTime: string;
  status: BookingStatus;
  termsAccepted: boolean;
  disclaimerAccepted: boolean;
  quoteAmount?: number;
  adminNotes?: string;
  depositAmount: number;
  depositPaid: boolean;
  paymentStatus: "unpaid" | "paid";
  stripeSessionId?: string;
  staffEarnings: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingInput {
  clientId: string;
  clientName: string;
  email: string;
  phone: string;
  service: string;
  stylistId?: string;
  stylistName?: string;
  size?: string;
  length?: string;
  notes?: string;
  hairProvided: HairProvidedOption;
  preferredDate: string;
  preferredTime: string;
  termsAccepted: boolean;
  disclaimerAccepted: boolean;
}

export interface Review {
  id: string;
  bookingId: string;
  clientId: string;
  clientName: string;
  stylistId?: string;
  stylistName?: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}
