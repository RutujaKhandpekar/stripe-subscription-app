import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export default async function handler(req, res) {
	try {
		if (req.method === "POST") return res.status(400);
		//currently fetching the data for the specific product
		const product = await stripe.products.retrieve(process.env.PRODUCT_ID);
		const productPrice = await stripe.prices.retrieve(product.default_price); // Fetch the product price
		res.json({
			product: product,
			productPrice: productPrice,
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Internal server error" });
	}
}
