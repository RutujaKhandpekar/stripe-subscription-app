import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe(
	process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

function Subscription() {
	const [showStripeForm, setShowStripeForm] = useState(false);
	const [productData, setProductData] = useState({});
	const [clientSecret, setClientSecret] = useState("");

	useEffect(() => {
		//Fetch the product to display it's details
		fetch("/api/product").then(async (response) => {
			const data = await response.json();
			setProductData(data);
		});
	});
	useEffect(() => {
		// Create PaymentIntent as soon as the page loads
		fetch("/api/payment_intent", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ items: [{ id: "xl-tshirt" }] }),
		})
			.then((res) => res.json())
			.then((data) => setClientSecret(data.clientSecret));
	}, []);

	const options = {
		clientSecret,
		loader: "auto",
	};

	return (
		<div
			className="bg-white lg:w-6/12 md:7/12 w-8/12 shadow-3xl rounded-xl p-12 md:p-4 my-16 mx-auto
        border-solid border-4"
		>
			{Object.keys(productData).length > 0 && (
				<div className="items-center text-lg mb-6 md:mb-8">
					<img
						src={productData?.product.images[0]}
						alt="Product"
						className="mx-auto"
						height={200}
						width={250}
					/>
					<div className="text-center">
						<h2 className="text-2xl mt-4">{productData.product.name}</h2>
						<p className="text-lg mt-2">
							{productData.productPrice.currency === "eur" ? "€" : "$"}
							{(productData.productPrice.unit_amount / 100).toFixed(2)}/
							{productData.productPrice.recurring.interval}
						</p>
					</div>
				</div>
			)}

			{showStripeForm && clientSecret ? (
				<Elements stripe={stripePromise} options={options}>
					<CheckoutForm productData={productData} />
				</Elements>
			) : (
				<div className="text-center">
					<button
						onClick={() => setShowStripeForm(true)}
						className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded uppercase text-lg"
					>
						Subscribe
					</button>
				</div>
			)}
		</div>
	);
}

export default Subscription;
