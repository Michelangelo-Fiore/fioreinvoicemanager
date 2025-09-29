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
const LogIn = async () => {
	// NOTE: no payload needed for OAuth start
	return fioreInvoiceManagerOnboarding.get("/fatture/auth");
};

/** Send a GET request to fetch Dashboard Details (legacy) */
const getDashboardDetails = async () => {
	// OAuth-protected API, no need to send email/password again
	return fioreInvoiceManagerApi.get("/dashboard/clients");
};

/** Get Clients */
const getClients = async (opts?: { signal?: AbortSignal }) => {
	// allow aborting from caller
	return fioreInvoiceManagerApi.get("/dashboard/clients", {
		signal: opts?.signal,
	});
};

/** Get Products */
const getProducts = async (opts?: { signal?: AbortSignal }) => {
	return fioreInvoiceManagerApi.get("/dashboard/products", {
		signal: opts?.signal,
	});
};

/** Get Receipts */
const getReceipts = async (opts?: { signal?: AbortSignal }) => {
	return fioreInvoiceManagerApi.get("/dashboard/receipts", {
		signal: opts?.signal,
	});
};

/** Get Reports */
const getReports = async (opts?: {
	signal?: AbortSignal;
	params?: { type?: string; startDate?: string; endDate?: string };
}) => {
	return fioreInvoiceManagerApi.get("/dashboard/reports", {
		signal: opts?.signal,
		params: opts?.params,
	});
};

export default {
	LogIn,
	getDashboardDetails,
	getClients,
	getProducts,
	getReceipts,
	getReports,
};
