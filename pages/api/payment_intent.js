import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export default async function handler(req, res) {
	try {
		if (req.method != "POST") return res.status(400);
		const paymentIntent = await stripe.paymentIntents.create({
			currency: "usd",
			amount: 1000,
			automatic_payment_methods: {
				enabled: true,
			},
		});
		res.json({
			clientSecret: paymentIntent.client_secret,
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Internal server error" });
	}
}
