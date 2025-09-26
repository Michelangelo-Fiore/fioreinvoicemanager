/* services.ts
   CHANGES:
   - Added getClients, getProducts, getReceipts functions to support the Dashboard's big resource dropdown.
   - Preserved original LogIn and getDashboardDetails functions for backward compatibility.
   - Functions accept an optional fetch signal for AbortController compatibility.
   - Followed existing comment style.
*/

import {
	fioreInvoiceManagerApi,
	fioreInvoiceManagerOnboarding,
} from "../../utils/config";

/** Send a GET request to start OAuth login (fatture auth) */
async function LogIn() {
	// NOTE: no payload needed for OAuth start
	return fioreInvoiceManagerOnboarding.get("/fatture/auth");
}

/** Send a GET request to fetch Dashboard Details (legacy) */
async function getDashboardDetails() {
	// OAuth-protected API, no need to send email/password again
	return fioreInvoiceManagerApi.get("/dashboard/clients");
}

/** Get Clients */
async function getClients(opts?: { signal?: AbortSignal }) {
	// allow aborting from caller
	return fioreInvoiceManagerApi.get("/dashboard/clients", {
		signal: opts?.signal,
	});
}

/** Get Products */
async function getProducts(opts?: { signal?: AbortSignal }) {
	return fioreInvoiceManagerApi.get("/dashboard/products", {
		signal: opts?.signal,
	});
}

/** Get Receipts */
async function getReceipts(opts?: { signal?: AbortSignal }) {
	return fioreInvoiceManagerApi.get("/dashboard/receipts", {
		signal: opts?.signal,
	});
}

export default {
	LogIn,
	getDashboardDetails,
	getClients,
	getProducts,
	getReceipts,
};
