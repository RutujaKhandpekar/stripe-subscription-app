import React from "react";

const Footer = () => {
	return (
		<footer className="bg-gray-200 text-gray-600 p-4 text-center fixed z-50 bg-gray-300 bottom-0 p-4 w-full">
			Copyright © {new Date().getFullYear()} - Flamond
		</footer>
	);
};

export default Footer;
