import Services from "./services";

/** Handle Fetch Dashboard Details / Generic Resource Fetcher */
export const handleFetchResource = async (
	resourceType: "clients" | "products" | "receipts" | "reports",
	setData: (data: any[]) => void,
	setError: (err: string | null) => void,
	setLoading: (loading: boolean) => void,
	signal?: AbortSignal,
	extraParams?: { type?: string; startDate?: string; endDate?: string },
) => {
	try {
		setLoading(true);
		setError(null);

		let response;
		if (resourceType === "clients") {
			response = await Services.getClients({ signal });
		} else if (resourceType === "products") {
			response = await Services.getProducts({ signal });
		} else if (resourceType === "receipts") {
			response = await Services.getReceipts({ signal });
		} else {
			// reports
			response = await Services.getReports({
				signal,
				params: extraParams,
			});
		}

		if (response && response.status === 200) {
			console.log(`${resourceType} Details ==>`, response.data);
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
		if (err?.name === "CanceledError" || err?.message === "canceled") return;
		setError(err?.message || "Failed to fetch resource details");
	} finally {
		setLoading(false);
	}
};
