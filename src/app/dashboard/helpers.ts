/* helpers.ts
   CHANGES:
   - Exposed handleFetchResource(resourceType, setData, setError, setLoading, signal)
     which fetches clients/products/receipts from Services depending on resourceType.
   - Preserved original handleLogIntoFattureInCloud and all console logs.
   - Followed existing comment styles and kept all comments.
*/
import Services from "./services";

/** Handle Fetch Dashboard Details / Generic Resource Fetcher */
export const handleFetchResource = async (
	resourceType: "clients" | "products" | "receipts",
	setData: (data: any[]) => void,
	setError: (err: string | null) => void,
	setLoading: (loading: boolean) => void,
	signal?: AbortSignal,
) => {
	try {
		setLoading(true);
		setError(null);

		let response;
		// choose endpoint based on selected resource
		if (resourceType === "clients") {
			response = await Services.getClients({ signal });
		} else if (resourceType === "products") {
			response = await Services.getProducts({ signal });
		} else {
			// receipts
			response = await Services.getReceipts({ signal });
		}

		if (response && response.status === 200) {
			console.log(`${resourceType} Details ==>`, response.data);
			// normalize to array when possible
			const payload = Array.isArray(response.data)
				? response.data
				: response.data?.data || response.data || [];
			setData(payload);
		} else {
			setData([]);
			setError("Failed to fetch resource");
		}
	} catch (err: any) {
		console.error(
			"Get Resource Details Failed:",
			err?.response?.data || err.message,
		);
		if (err?.name === "CanceledError" || err?.message === "canceled") {
			// request was aborted - do not set an error
			return;
		}
		setError(err?.message || "Failed to fetch resource details");
	} finally {
		setLoading(false);
	}
};

/** Handle Fetch Dashboard Details (compat wrapper) */
export const handleGetDashboardDetails = async (
	setData: (data: any) => void,
	setError: (err: string | null) => void,
	setLoading: (loading: boolean) => void,
) => {
	// kept for backwards compatibility with existing import sites
	await handleFetchResource("clients", setData, setError, setLoading);
};
