# The Light App — Final Master Build
- Elegant, accessible UI (dark + orange rays vibe)
- Pages: Home, Features, Premium, Login, Signup, Dashboard, Privacy
- Firebase Auth (Email/Password) using Hosting auto-config (no keys to paste)
- Stripe-ready functions: `/createCheckout`, `stripeWebhook` → sets custom claim `{ premium: true }`

## Deploy
```
firebase use the-light-2025
firebase deploy
```
(Deploys Hosting + Functions.)

## Stripe config
```
firebase functions:config:set stripe.secret="sk_test_..." stripe.webhook_secret="whsec_..." stripe.price_id="price_..."
firebase deploy --only functions
```
Set your webhook to: `https://us-central1-the-light-2025.cloudfunctions.net/stripeWebhook`

## How Premium is detected
Webhook sets the `premium` claim on the user (matching by email). Client checks the ID token.
