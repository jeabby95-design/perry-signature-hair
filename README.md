# perry-signature-hair

## Local setup

1. Install dependencies:
	npm install
2. Copy environment variables:
	cp .env.example .env
3. Fill in Firebase and Stripe values in .env.
4. Start development server:
	npm run dev

## Firebase requirements

- Enable Email/Password in Firebase Authentication.
- Create Firestore database.
- Create Firebase Storage bucket.
- Add security rules for users, bookings, and reviews according to your role model.

## Stripe checkout endpoint contract

Set VITE_STRIPE_CHECKOUT_ENDPOINT to your backend endpoint that creates a Stripe Checkout session.

The frontend posts this payload:

- bookingId
- userId
- customerEmail
- amountInPence
- currency
- successUrl
- cancelUrl

Your backend should return JSON with:

- url: Checkout URL to redirect the client to.

On successful payment, Stripe should return the user to:

- /payment/success?bookingId=<bookingId>&session_id=<sessionId>

The app marks the booking deposit as paid and confirms the booking on this page.