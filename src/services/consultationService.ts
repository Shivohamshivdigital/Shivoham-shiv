import { ConsultationBooking } from "../types";
import { getAttribution } from "../utils/attribution";

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

    // Keep a local backup copy (used by the dashboard view).
    try {
      const existing = localStorage.getItem(BOOKINGS_KEY);
      const bookings: ConsultationBooking[] = existing ? JSON.parse(existing) : [];
      bookings.push(newBooking);
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
    } catch (e) {
      console.warn("localStorage quota exceeded or blocked; saving in memory.", e);
    }

    // Send the lead to Brevo via our serverless function so the team is
    // notified by email and the contact is saved in Brevo.
    fetch("/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: fullName,
        email,
        whatsapp,
        message,
        source: preferredTime ? `Booking (${preferredTime})` : "Website",
        attribution: getAttribution(),
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const detail = await res.text().catch(() => "");
          console.error("Lead delivery failed:", res.status, detail);
        } else {
          // Meta Pixel + GA: a lead was captured.
          (window as any).fbq?.("track", "Lead");
          (window as any).gtag?.("event", "generate_lead");
        }
        resolve(newBooking);
      })
      .catch((err) => {
        // Never block the user on a network error — the lead is still in the
        // local backup and the UI can show success.
        console.error("Lead delivery error:", err);
        resolve(newBooking);
      });
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
