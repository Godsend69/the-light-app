import * as functions from 'firebase-functions';
import admin from 'firebase-admin';
import Stripe from 'stripe';
import corsLib from 'cors';
admin.initializeApp();
const db = admin.firestore();
const cors = corsLib({ origin: true });
const STRIPE_SECRET = functions.config().stripe?.secret || '';
const WEBHOOK_SECRET = functions.config().stripe?.webhook_secret || '';
const stripe = new Stripe(STRIPE_SECRET || 'sk_test_placeholder', { apiVersion: '2023-10-16' });
export const createCheckout = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') return res.status(405).send('Method not allowed');
    try {
      const priceId = functions.config().stripe?.price_id || 'price_placeholder';
      const domain = `https://${process.env.GCLOUD_PROJECT}.web.app`;
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${domain}/premium.html?success=1`,
        cancel_url: `${domain}/premium.html?canceled=1`,
      });
      res.json({ url: session.url });
    } catch (err) { console.error(err); res.status(500).json({ error: String(err.message || err) }); }
  });
});
export const stripeWebhook = functions.https.onRequest(async (req, res) => {
  let event = req.body;
  if (WEBHOOK_SECRET) {
    const signature = req.headers['stripe-signature'];
    try { event = stripe.webhooks.constructEvent(req.rawBody, signature, WEBHOOK_SECRET); }
    catch (err) { console.error('Webhook signature verification failed.', err.message); return res.status(400).send(`Webhook Error: ${err.message}`); }
  }
  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const email = session.customer_details?.email;
      if (email) {
        const userRecord = (await admin.auth().getUserByEmail(email)).toJSON();
        if (userRecord?.uid) {
          await admin.auth().setCustomUserClaims(userRecord.uid, { premium: true });
          await db.collection('premium').doc(userRecord.uid).set({ active:true, ts: admin.firestore.FieldValue.serverTimestamp() });
        }
      }
    }
    res.json({ received: true });
  } catch (e) { console.error(e); res.status(500).send('Internal error'); }
});
