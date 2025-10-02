import { apiBaseUrl } from "../../utils/config";
import { GeneralAuthRoutes } from "../../utils/urls";

/** Handle Log Into FattureInCloud */
export const handleLogIntoFattureInCloud = async (
	router,
	setErrorMessage: (msg: string) => void,
) => {
	try {
		console.log("Login Started stage 1 ==>");

		const authWindow = window.open(`${apiBaseUrl}/fatture/auth`, "_blank");
		if (!authWindow) throw new Error("Unable to open authentication window.");

		console.log("Login stage 2 ==>");

		const allowedOrigins = [
			"http://localhost:3000",
			"https://fioreinvoicemanager.vercel.app",
			"https://fioreinvoicemanager.onrender.com", // ✅ add backend too
		];

		const handleMessage = (event: MessageEvent) => {
			console.log("event.origin ==>", event.origin);
			console.log("event.data ==>", event.data);

			// allow if origin matches one of the known domains
			// if (!allowedOrigins.includes(event.origin)) return;

			if (event.data?.status === "success") {
				console.log("Login Success:", event.data);
				router.push(GeneralAuthRoutes.dashboard);
				window.removeEventListener("message", handleMessage);
			} else if (event.data?.status === "error") {
				console.error("Login Failed:", event.data.message);
				setErrorMessage(event.data.message || "Login failed");
				window.removeEventListener("message", handleMessage);
			}
		};

		window.addEventListener("message", handleMessage);

		console.log("Login stage 3 ==>");

		const checkWindowClosed = setInterval(() => {
			if (authWindow.closed) {
				clearInterval(checkWindowClosed);
				window.removeEventListener("message", handleMessage);
				console.log("Login stage 4 ==>");
			}
		}, 500);
	} catch (err: any) {
		console.error("Login Failed:", err?.message || err);
		setErrorMessage(err?.message || "Login failed");
	}
};
