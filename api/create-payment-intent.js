// Vercel Serverless Function — Stripe PaymentIntent
// Place this file at: api/create-payment-intent.js in your GitHub repo

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, hireType, date } = req.body;

    // Create a PaymentIntent for $100 AUD deposit
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 10000, // $100.00 in cents
      currency: 'aud',
      payment_method_types: ['card'],
      description: `RR Transport booking deposit — ${hireType} hire on ${date}`,
      metadata: {
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        hire_type: hireType,
        pickup_date: date,
      },
      receipt_email: email,
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });

  } catch (err) {
    console.error('Stripe error:', err);
    res.status(500).json({ error: err.message });
  }
};
