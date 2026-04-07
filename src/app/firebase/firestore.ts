import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  runTransaction,
  setDoc,
  updateDoc,
  where,
  type DocumentData,
  type QueryConstraint,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import {
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { db, storage } from "./config";
import type {
  AvailabilityDay,
  BlockedDate,
  Booking,
  BookingStatus,
  CreateBookingInput,
  Review,
  UserProfile,
} from "../types/domain";

export const BOOKING_DEPOSIT_GBP = 15;
export const STAFF_EARNINGS_PERCENT = 0.55;

function nowIso() {
  return new Date().toISOString();
}

function roundToCurrency(value: number) {
  return Math.round(value * 100) / 100;
}

function parseDoc<T>(
  snapshot: QueryDocumentSnapshot<DocumentData>,
): T {
  return {
    id: snapshot.id,
    ...(snapshot.data() as object),
  } as T;
}

function getSafeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9.-_]/g, "_");
}

export async function uploadBookingImage(
  file: File,
  bookingId: string,
): Promise<string> {
  const imageRef = ref(
    storage,
    `bookings/${bookingId}/${Date.now()}-${getSafeFileName(file.name)}`,
  );

  await uploadBytes(imageRef, file);
  return getDownloadURL(imageRef);
}

export async function createBooking(
  input: CreateBookingInput,
  imageFile?: File | null,
): Promise<string> {
  const bookingRef = doc(collection(db, "bookings"));

  let imageUrl: string | undefined;
  if (imageFile) {
    imageUrl = await uploadBookingImage(imageFile, bookingRef.id);
  }

  const bookingPayload: Omit<Booking, "id"> = {
    clientId: input.clientId,
    clientName: input.clientName,
    email: input.email,
    phone: input.phone,
    service: input.service,
    stylistId: input.stylistId,
    stylistName: input.stylistName,
    size: input.size,
    length: input.length,
    notes: input.notes,
    imageUrl,
    hairProvided: input.hairProvided,
    preferredDate: input.preferredDate,
    preferredTime: input.preferredTime,
    status: "pending",
    termsAccepted: input.termsAccepted,
    disclaimerAccepted: input.disclaimerAccepted,
    quoteAmount: undefined,
    adminNotes: undefined,
    depositAmount: BOOKING_DEPOSIT_GBP,
    depositPaid: false,
    paymentStatus: "unpaid",
    stripeSessionId: undefined,
    staffEarnings: 0,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };

  await setDoc(bookingRef, bookingPayload);
  return bookingRef.id;
}

async function listBookings(constraints: QueryConstraint[] = []) {
  const bookingsRef = collection(db, "bookings");
  const bookingQuery = query(bookingsRef, ...constraints);
  const snapshot = await getDocs(bookingQuery);

  const bookings = snapshot.docs.map((docSnapshot) =>
    parseDoc<Booking>(docSnapshot),
  );

  return bookings.sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
}

export async function getAllBookings(): Promise<Booking[]> {
  return listBookings();
}

export async function getBookingsForClient(clientId: string): Promise<Booking[]> {
  return listBookings([where("clientId", "==", clientId)]);
}

export async function getBookingsForStaff(staffId: string): Promise<Booking[]> {
  return listBookings([where("stylistId", "==", staffId)]);
}

export async function getBookingById(bookingId: string): Promise<Booking | null> {
  const snapshot = await getDoc(doc(db, "bookings", bookingId));
  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...(snapshot.data() as Omit<Booking, "id">),
  };
}

export async function sendQuoteForBooking(
  bookingId: string,
  payload: {
    quoteAmount: number;
    stylistId: string;
    stylistName: string;
    adminNotes?: string;
  },
) {
  const quoteAmount = Number(payload.quoteAmount);
  if (!Number.isFinite(quoteAmount) || quoteAmount <= 0) {
    throw new Error("Quote amount must be greater than 0.");
  }

  await updateDoc(doc(db, "bookings", bookingId), {
    quoteAmount,
    status: "quoted",
    stylistId: payload.stylistId,
    stylistName: payload.stylistName,
    adminNotes: payload.adminNotes ?? "",
    staffEarnings: roundToCurrency(quoteAmount * STAFF_EARNINGS_PERCENT),
    updatedAt: nowIso(),
  });
}

export async function assignBookingToStaff(
  bookingId: string,
  stylistId: string,
  stylistName: string,
) {
  await updateDoc(doc(db, "bookings", bookingId), {
    stylistId,
    stylistName,
    updatedAt: nowIso(),
  });
}

export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus,
) {
  await updateDoc(doc(db, "bookings", bookingId), {
    status,
    updatedAt: nowIso(),
  });
}

export async function markBookingCompleted(bookingId: string) {
  await runTransaction(db, async (tx) => {
    const bookingRef = doc(db, "bookings", bookingId);
    const bookingSnap = await tx.get(bookingRef);

    if (!bookingSnap.exists()) {
      throw new Error("Booking not found.");
    }

    const booking = bookingSnap.data() as Omit<Booking, "id">;
    const quoteAmount = booking.quoteAmount ?? 0;
    const pointsToAdd = Math.max(0, Math.round(quoteAmount));

    tx.update(bookingRef, {
      status: "completed",
      staffEarnings: roundToCurrency(quoteAmount * STAFF_EARNINGS_PERCENT),
      updatedAt: nowIso(),
    });

    if (booking.clientId) {
      const userRef = doc(db, "users", booking.clientId);
      const userSnap = await tx.get(userRef);
      if (userSnap.exists()) {
        const profile = userSnap.data() as UserProfile;
        tx.update(userRef, {
          points: (profile.points ?? 0) + pointsToAdd,
          updatedAt: nowIso(),
        });
      }
    }
  });
}

export async function markBookingDepositPaid(
  bookingId: string,
  stripeSessionId?: string,
) {
  await updateDoc(doc(db, "bookings", bookingId), {
    depositPaid: true,
    paymentStatus: "paid",
    status: "confirmed",
    stripeSessionId: stripeSessionId ?? "",
    updatedAt: nowIso(),
  });
}

export async function createReview(payload: {
  bookingId: string;
  clientId: string;
  clientName: string;
  stylistId?: string;
  stylistName?: string;
  rating: number;
  comment: string;
}): Promise<string> {
  if (payload.rating < 1 || payload.rating > 5) {
    throw new Error("Rating must be between 1 and 5.");
  }

  const docRef = await addDoc(collection(db, "reviews"), {
    ...payload,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  });

  return docRef.id;
}

export async function getReviewsByClient(clientId: string): Promise<Review[]> {
  const reviewQuery = query(
    collection(db, "reviews"),
    where("clientId", "==", clientId),
  );
  const snapshot = await getDocs(reviewQuery);

  const reviews = snapshot.docs.map((docSnapshot) =>
    parseDoc<Review>(docSnapshot),
  );

  return reviews.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function deleteReview(reviewId: string): Promise<void> {
  await deleteDoc(doc(db, "reviews", reviewId));
}

export async function getCompletedBookingsPendingReview(
  clientId: string,
): Promise<Booking[]> {
  const [bookings, reviews] = await Promise.all([
    getBookingsForClient(clientId),
    getReviewsByClient(clientId),
  ]);

  const reviewedBookingIds = new Set(reviews.map((review) => review.bookingId));
  return bookings.filter(
    (booking) =>
      booking.status === "completed" && !reviewedBookingIds.has(booking.id),
  );
}

export async function getUserProfileById(
  uid: string,
): Promise<UserProfile | null> {
  const profileSnap = await getDoc(doc(db, "users", uid));
  if (!profileSnap.exists()) {
    return null;
  }

  return profileSnap.data() as UserProfile;
}

export async function createOrUpdateUserProfile(profile: UserProfile) {
  await setDoc(doc(db, "users", profile.uid), profile, { merge: true });
}

export async function getStaffUsers(): Promise<UserProfile[]> {
  const staffQuery = query(collection(db, "users"), where("role", "==", "staff"));
  const snapshot = await getDocs(staffQuery);

  return snapshot.docs
    .map((docSnapshot) => docSnapshot.data() as UserProfile)
    .filter((staff) => staff.status !== "inactive")
    .sort((a, b) => a.fullName.localeCompare(b.fullName));
}

export async function getClientUsers(): Promise<UserProfile[]> {
  const clientQuery = query(collection(db, "users"), where("role", "==", "client"));
  const snapshot = await getDocs(clientQuery);

  return snapshot.docs
    .map((docSnapshot) => docSnapshot.data() as UserProfile)
    .sort((a, b) => a.fullName.localeCompare(b.fullName));
}

export async function adjustUserPoints(uid: string, delta: number) {
  await runTransaction(db, async (tx) => {
    const userRef = doc(db, "users", uid);
    const userSnap = await tx.get(userRef);

    if (!userSnap.exists()) {
      throw new Error("User profile not found.");
    }

    const profile = userSnap.data() as UserProfile;
    const nextPoints = Math.max(0, (profile.points ?? 0) + delta);

    tx.update(userRef, {
      points: nextPoints,
      updatedAt: nowIso(),
    });
  });
}

export async function redeemLoyaltyPoints(uid: string, pointsToRedeem: number) {
  if (!Number.isFinite(pointsToRedeem) || pointsToRedeem <= 0) {
    throw new Error("Points to redeem must be greater than 0.");
  }

  await runTransaction(db, async (tx) => {
    const userRef = doc(db, "users", uid);
    const userSnap = await tx.get(userRef);

    if (!userSnap.exists()) {
      throw new Error("User profile not found.");
    }

    const profile = userSnap.data() as UserProfile;
    const currentPoints = profile.points ?? 0;

    if (currentPoints < pointsToRedeem) {
      throw new Error("Not enough loyalty points to redeem this reward.");
    }

    tx.update(userRef, {
      points: currentPoints - pointsToRedeem,
      updatedAt: nowIso(),
    });
  });
}

export async function updateStaffAvailability(
  uid: string,
  availability: AvailabilityDay[],
  blockedDates: BlockedDate[],
) {
  await updateDoc(doc(db, "users", uid), {
    availability,
    blockedDates,
    updatedAt: nowIso(),
  });
}

export async function updateStaffStatus(
  uid: string,
  status: "active" | "inactive",
) {
  await updateDoc(doc(db, "users", uid), {
    status,
    updatedAt: nowIso(),
  });
}

export async function createStaffInvite(payload: {
  fullName: string;
  email: string;
  invitedBy: string;
}) {
  await addDoc(collection(db, "staff_invites"), {
    ...payload,
    status: "pending",
    createdAt: nowIso(),
  });
}
