import React, { useState } from "react";
import {
	AddressElement,
	PaymentElement,
	useStripe,
	useElements,
} from "@stripe/react-stripe-js";

function CheckoutForm(props) {
	const stripe = useStripe();
	const elements = useElements();
	const [isProcessing, setIsProcessing] = useState(false);

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (!stripe || !elements) {
			notifyWarning(
				"Still loading. Please wait a few seconds and then try again."
			);
			return;
		}
		try {
			setIsProcessing(true);
			const response = await fetch("/api/subscribe", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					productID: props.productData.product.id,
					price: props.productData.productPrice.unit_amount,
				}),
			});
			if (!response.ok) return alert("Payment unsuccessful!");
			const data = await response.json();
			//once the subscription is done, make the payment
			const confirm = await stripe.confirmCardPayment(data.clientSecret);
			if (confirm.error) return alert("Payment unsuccessful!");
			alert("Payment Successful! Subscription active.");
			setIsProcessing(false);
		} catch (err) {
			console.error(err);
			setIsProcessing(false);
			alert("Payment failed! " + err.message);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<div>
				<div className="divide-y">
					<div className="items-center text-lg mb-4">
						<AddressElement options={{ mode: "shipping" }} />
					</div>
					<div className="items-center text-lg mb-4 pt-4">
						<PaymentElement
							clientSecret={{ CLIENT_SECRET: process.env.STRIPE_SECRET_KEY }}
						/>
					</div>
				</div>
				<button
					disabled={isProcessing}
					className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded uppercase text-lg"
				>
					{isProcessing ? "Processing..." : "Subscribe"}
				</button>
			</div>
		</form>
	);
}

export default CheckoutForm;
