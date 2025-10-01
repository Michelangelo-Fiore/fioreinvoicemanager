import Services from "./services";

/** Handle Fetch Dashboard Details / Generic Resource Fetcher */
export const handleFetchResource = async (
	resourceType:
		| "clients"
		| "receipts"
		| "suppliers"
		| "issued-documents"
		| "received-documents",
	setData: (data: any[]) => void,
	setError: (err: string | null) => void,
	setLoading: (loading: boolean) => void,
	signal?: AbortSignal,
	extraParams?: {
		startDate?: string;
		endDate?: string;
		page?: number; // ✅ added
		pageSize?: number; // ✅ added
		filterField?: string; // ✅ added
		filterValue?: string; // ✅ added
	},
) => {
	try {
		setLoading(true);
		setError(null);

		let response;
		if (resourceType === "clients") {
			response = await Services.getClients({
				signal,
				params: { ...extraParams },
			});
		} else if (resourceType === "receipts") {
			response = await Services.getReceipts({
				signal,
				params: { ...extraParams },
			});
		} else if (resourceType === "suppliers") {
			response = await Services.getSuppliers({ signal, params: {} });
		} else if (resourceType === "issued-documents") {
			response = await Services.getIssuedDocuments({
				signal,
				params: { ...extraParams },
			});
		} else {
			response = await Services.getReceivedDocuments({
				signal,
				params: { ...extraParams },
			});
		}

		if (response && response.status === 200) {
			// ✅ Always extract from response.data.data (standardResponse wrapper)
			const payload = response?.data?.data ?? [];
			console.log(`${resourceType} Payload ==>`, payload);
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
