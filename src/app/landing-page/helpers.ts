import { apiBaseUrl, backendUrl } from "../../utils/config";
import { GeneralAuthRoutes } from "../../utils/urls";

/** Handle Log Into FattureInCloud */
export const handleLogIntoFattureInCloud = async (
	router,
	setErrorMessage: (msg: string) => void,
) => {
	try {
		console.log("Login Started");

		// Open a new tab to start the OAuth flow via your backend
		const authWindow = window.open(`${apiBaseUrl}/fatture/auth`, "_blank");

		if (!authWindow) {
			throw new Error("Unable to open authentication window.");
		}

		// ✅ Listen for messages from backend OAuth redirect
		const handleMessage = (event: MessageEvent) => {
			console.log("event.origin ==>", event.origin);
			console.log("event.data ==>", event.data);

			// ✅ validate against frontend origin (to match backend postMessage)
			if (event.origin !== backendUrl) return;

			if (event.data?.status === "success") {
				console.log("Login Success:", event.data);
				router.push(GeneralAuthRoutes.dashboard);
				window.removeEventListener("message", handleMessage); // cleanup
			} else if (event.data?.status === "error") {
				console.error("Login Failed:", event.data.message);
				setErrorMessage(event.data.message || "Login failed");
				window.removeEventListener("message", handleMessage); // cleanup
			}
		};

		window.addEventListener("message", handleMessage);

		// optional: cleanup when window is closed
		const checkWindowClosed = setInterval(() => {
			if (authWindow.closed) {
				clearInterval(checkWindowClosed);
				window.removeEventListener("message", handleMessage);
			}
		}, 500);
	} catch (err: any) {
		console.error("Login Failed:", err?.message || err);
		setErrorMessage(err?.message || "Login failed");
	}
};
