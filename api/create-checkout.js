const Stripe = require('stripe');

module.exports = async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'subscription',
    line_items: [
      {
        price: req.body.priceId,
        quantity: 1,
      },
    ],
    success_url: 'https://YOUR-SITE.vercel.app/success',
    cancel_url: 'https://YOUR-SITE.vercel.app/',
  });

  res.json({ url: session.url });
};
