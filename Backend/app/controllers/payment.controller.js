const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const db = require('../models');
const Booking = db.Booking;

exports.createCheckoutSession = async (req, res) => {
  try {
    const { bookingId, amount, technicianStripeAccountId } = req.body;
    
    if (!bookingId || !amount) {
      return res.status(400).json({ success: false, message: 'Missing bookingId or amount' });
    }

    // Admin takes 2%
    const applicationFeeAmount = Math.round(amount * 0.02 * 100); // in cents

    const sessionConfig = {
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Booking #${bookingId}`,
            },
            unit_amount: Math.round(amount * 100), // in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:8081/payment/success?booking_id=${bookingId}`,
      cancel_url: `http://localhost:8081/payment/cancel`,
    };

    // If technician has a connected Stripe account, use Stripe Connect to split
    if (technicianStripeAccountId) {
      sessionConfig.payment_intent_data = {
        application_fee_amount: applicationFeeAmount,
        transfer_data: {
          destination: technicianStripeAccountId,
        },
      };
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    res.json({ success: true, url: session.url, sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
