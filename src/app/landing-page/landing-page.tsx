"use client";
import { useEffect } from "react";
import Login from "./log-in";

/** Landing Page */
const LandingPage: React.FC = () => {
	useEffect(() => {
		// Instantiate your clean up function
		const ac = new AbortController();

		// WRITE YOUR DESIRED USE EFFECT FUNCTION & COMMENT BELOW
		document.title = "Fiore Invoice Manager 📊";

		// Return your clean up function
		return function cleanup() {
			ac.abort();
		};
	}, []);

	return (
		<>
			<section>
				<Login />
			</section>
		</>
	);
};

export default LandingPage;
