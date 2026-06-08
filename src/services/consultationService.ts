import { ConsultationBooking } from "../types";

const BOOKINGS_KEY = "shivoham_consultations";

export async function bookConsultation(
  fullName: string,
  email: string,
  whatsapp: string,
  message?: string,
  preferredTime?: string
): Promise<ConsultationBooking> {
  return new Promise((resolve) => {
    const newBooking: ConsultationBooking = {
      id: "booking_" + Math.random().toString(36).substr(2, 9),
      fullName,
      email,
      whatsapp,
      message,
      preferredTime: preferredTime || "Morning (9 AM - 12 PM)",
      status: "confirmed",
      createdAt: new Date().toISOString()
    };

    try {
      const existing = localStorage.getItem(BOOKINGS_KEY);
      const bookings: ConsultationBooking[] = existing ? JSON.parse(existing) : [];
      bookings.push(newBooking);
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
    } catch (e) {
      console.warn("localStorage quota exceeded or blocked; saving in memory.", e);
    }

    setTimeout(() => {
      resolve(newBooking);
    }, 400);
  });
}

export async function getBookings(): Promise<ConsultationBooking[]> {
  return new Promise((resolve) => {
    try {
      const existing = localStorage.getItem(BOOKINGS_KEY);
      resolve(existing ? JSON.parse(existing) : []);
    } catch (e) {
      resolve([]);
    }
  });
}
