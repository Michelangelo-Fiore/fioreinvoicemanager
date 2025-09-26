import { useEffect, useState } from "react";

export const useWindowResize = () => {
	// ✅ Start with safe defaults (runs fine on server)
	const [width, setWidth] = useState(0);
	const [height, setHeight] = useState(0);

	useEffect(() => {
		// ✅ Runs only on client
		const updateSize = () => {
			setWidth(window.innerWidth);
			setHeight(window.innerHeight);
		};

		// Set initial size
		updateSize();

		// Listen for resize
		window.addEventListener("resize", updateSize);
		return () => {
			window.removeEventListener("resize", updateSize);
		};
	}, []);

	return { width, height };
};

export default useWindowResize;
