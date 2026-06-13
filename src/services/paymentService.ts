// Razorpay checkout helper.
// Talks to our serverless endpoints (/api/razorpay/*) so the secret key
// never touches the browser.

declare global {
  interface Window {
    Razorpay?: any;
  }
}

export type PaymentPlan = "register" | "course";

export interface PaymentPrefill {
  name?: string;
  email?: string;
  contact?: string;
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Starts a Razorpay payment for the given plan.
 * Resolves on verified success, rejects on failure/cancel.
 */
export async function startPayment(plan: PaymentPlan, prefill: PaymentPrefill = {}) {
  const loaded = await loadRazorpayScript();
  if (!loaded) throw new Error("Payment could not load. Please check your connection and try again.");

  // 1) Create an order on the server.
  const orderRes = await fetch("/api/razorpay/order", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ plan }),
  });
  if (!orderRes.ok) {
    const detail = await orderRes.json().catch(() => ({}));
    throw new Error(detail.error || "Could not start the payment. Please try again.");
  }
  const { orderId, amount, currency, keyId, label } = await orderRes.json();

  // 2) Open the Razorpay checkout and verify on success.
  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay({
      key: keyId,
      amount,
      currency,
      name: "Shivoham Shiv",
      description: label,
      order_id: orderId,
      image: "/shivoham-shiv-logo.jpg",
      prefill,
      theme: { color: "#2F5D50" },
      handler: async (response: any) => {
        try {
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ ...response, plan, ...prefill }),
          });
          const data = await verifyRes.json().catch(() => ({}));
          if (verifyRes.ok && data.success) resolve(data);
          else reject(new Error(data.error || "Payment verification failed."));
        } catch (err) {
          reject(err);
        }
      },
      modal: {
        ondismiss: () => reject(new Error("Payment cancelled.")),
      },
    });
    rzp.open();
  });
}
