// import { fioreInvoiceManagerOnboarding } from "../../utils/config";

// export default {
// 	/** Send a POST request to Log In */
// 	async LogIn(email: string, password: string) {
// 		const data = {
// 			email,
// 			password,
// 		};
// 		const stringifiedData = JSON.stringify(data);
// 		return fioreInvoiceManagerOnboarding.post(
// 			"/authentication/log-in",
// 			stringifiedData,
// 		);
// 	},
// };

// import { fioreInvoiceManagerOnboarding } from "../../utils/config";

// export default {
// 	/** Send a POST request to Log In */
// 	async LogIn(email: string, password: string) {
// 		const data = { email, password };
// 		return fioreInvoiceManagerOnboarding.get("fatture/auth", data);
// 	},
// };

// import Services from "./services";

/** Handle Log Into FattureInCloud */
// export const handleLogIntoFattureInCloud = async () => {
// 	try {
// 		console.log("Login Started");

// 		// Replace with real values or form inputs
// 		const email = "chukwuebuka.tech@gmail.com";
// 		const password = "password1232333";

// 		const response = await Services.LogIn(email, password);

// 		if (response.status === 200) {
// 			console.log("Login Success:", response.data);
// 			// TODO: set cookie, push router to dashboard, etc
// 		}
// 	} catch (err: any) {
// 		console.error("Login Failed:", err?.response?.data || err.message);
// 	}
// };
