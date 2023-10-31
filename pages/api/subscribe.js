import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
	try {
		if (req.method != "POST") return res.status(400);
		const { productID, price } = req.body;

		// Create a subscription
		const subscription = await stripe.subscriptions.create({
			customer: process.env.CUSTOMER_ID, // provide the specific customer
			items: [
				{
					price_data: {
						currency: "USD",
						product: productID,
						unit_amount: price,
						recurring: {
							interval: "month",
						},
					},
				},
			],

			payment_settings: {
				payment_method_types: ["card"],
				save_default_payment_method: "on_subscription",
			},
			expand: ["latest_invoice.payment_intent"],
		});
		// Send back the client secret for payment
		res.json({
			message: "Subscription successfully initiated",
			clientSecret: subscription.latest_invoice.payment_intent.client_secret,
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Internal server error" });
	}
}
