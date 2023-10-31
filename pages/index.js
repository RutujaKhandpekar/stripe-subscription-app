import Header from "../components/Header";
import Footer from "../components/Footer";
import Subscription from "../components/Subscription";

export default function Home() {
	return (
		<div className="container mx-auto p-4">
			<Header />
			<main className="bg-yellow-400 dark:bg-gray-800 flex items-center justify-center h-screen py-2 ">
				<Subscription />
			</main>
			<Footer />
		</div>
	);
}
