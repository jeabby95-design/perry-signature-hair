import { loadStripe } from "@stripe/stripe-js";

export const FIXED_DEPOSIT_GBP = 15;

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? "");

interface StripeCheckoutRequest {
  bookingId: string;
  userId: string;
  customerEmail: string;
}

interface StripeCheckoutResponse {
  url?: string;
}

export async function startDepositCheckout(
  payload: StripeCheckoutRequest,
): Promise<void> {
  const endpoint = import.meta.env.VITE_STRIPE_CHECKOUT_ENDPOINT;
  const baseUrl = window.location.origin;

  if (!endpoint) {
    throw new Error(
      "Missing VITE_STRIPE_CHECKOUT_ENDPOINT. Add your Stripe checkout API endpoint to environment variables.",
    );
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      bookingId: payload.bookingId,
      userId: payload.userId,
      customerEmail: payload.customerEmail,
      amountInPence: FIXED_DEPOSIT_GBP * 100,
      currency: "gbp",
      successUrl: `${baseUrl}/payment/success?bookingId=${payload.bookingId}`,
      cancelUrl: `${baseUrl}/client/bookings/${payload.bookingId}`,
    }),
  });

  if (!response.ok) {
    throw new Error("Unable to create Stripe checkout session.");
  }

  const data = (await response.json()) as StripeCheckoutResponse;

  if (data.url) {
    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error("Stripe failed to initialize.");
    }
    window.location.assign(data.url);
    return;
  }

  throw new Error("Stripe checkout response was invalid.");
}
