"use client";
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { handleFetchResource } from "./helpers"; // fetcher

dayjs.extend(isoWeek);

/** Dashboard Page */
const Dashboard: React.FC = () => {
	const [data, setData] = useState<any[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	/* UI states */
	const [resourceType, setResourceType] = useState<
		| "clients"
		| "receipts"
		| "issued-documents"
		| "suppliers"
		| "received-documents"
	>("clients"); // ✅ default now is clients
	const [reportType, setReportType] = useState<"weekly" | "monthly">("weekly");
	const [startDate, setStartDate] = useState<string>("");
	const [endDate, setEndDate] = useState<string>("");
	const [filterField, setFilterField] = useState<string>("");
	const [filterValue, setFilterValue] = useState<string>("");
	const [page, setPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(10);

	/* Compute default ranges */
	const computeDefaultRange = (type: "weekly" | "monthly") => {
		const now = dayjs();
		if (type === "weekly") {
			return {
				start: now.startOf("isoWeek").format("YYYY-MM-DD"),
				end: now.endOf("isoWeek").format("YYYY-MM-DD"),
			};
		}
		return {
			start: now.startOf("month").format("YYYY-MM-DD"),
			end: now.endOf("month").format("YYYY-MM-DD"),
		};
	};

	/* Pre-fill default dates only if NOT clients */
	useEffect(() => {
		if (resourceType !== "clients") {
			const { start, end } = computeDefaultRange(reportType);
			setStartDate(start);
			setEndDate(end);
		} else {
			setStartDate("");
			setEndDate("");
		}
	}, [reportType, resourceType]);

	/* Fetch resource */
	useEffect(() => {
		const ac = new AbortController();

		// ✅ clients → no filters, just 1 call
		const params =
			resourceType === "clients"
				? {}
				: { startDate, endDate, page, pageSize, filterField, filterValue };

		handleFetchResource(
			resourceType,
			setData,
			setError,
			setLoading,
			ac.signal,
			params,
		).catch((err) => {
			console.error("handleFetchResource Error:", err);
		});

		return () => ac.abort();
	}, [
		resourceType,
		reportType,
		startDate,
		endDate,
		page,
		pageSize,
		filterField,
		filterValue,
	]);

	/** Derived columns */
	const columns: string[] = data && data.length > 0 ? Object.keys(data[0]) : [];

	/** Default filter field */
	useEffect(() => {
		if (columns.length > 0 && !filterField) {
			setFilterField(columns[0]);
		}
	}, [columns, filterField]);

	/** Filtering (local, only for clients) */
	const filteredData = useMemo(() => {
		if (!Array.isArray(data)) return [];
		if (resourceType !== "clients") return data; // ✅ skip local filtering for BE-paginated resources
		return data.filter((row) => {
			if (!filterField || !filterValue) return true;
			const cell = (row as any)[filterField];
			if (cell === undefined || cell === null) return false;
			return String(cell).toLowerCase().includes(filterValue.toLowerCase());
		});
	}, [data, filterField, filterValue, resourceType]);

	/** Pagination (local for clients only) */
	const totalItems = filteredData.length;
	const totalPages =
		resourceType === "clients"
			? Math.max(1, Math.ceil(totalItems / pageSize))
			: 1;
	const paginatedData =
		resourceType === "clients"
			? filteredData.slice(
					(page - 1) * pageSize,
					(page - 1) * pageSize + pageSize,
				)
			: filteredData;

	/** Desktop View */
	const desktopView = () => (
		<div>
			<div className="text-black font-LibreFranklin px-6 py-8 min-h-screen">
				<div className="max-w-6xl mx-auto">
					<p className="font-semibold text-4xl text-center mb-[60px]">
						Dashboard - Fiore Invoice Manager 📊
					</p>

					{/* Page Header */}
					<div className="flex items-center justify-between mb-6">
						<div>
							<p className="text-sm text-gray-600 mt-1">
								{resourceType.charAt(0).toUpperCase() + resourceType.slice(1)} •{" "}
								{totalItems} record
								{totalItems !== 1 ? "s" : ""}
							</p>
						</div>

						{/* Resource dropdown */}
						<div className="flex items-center gap-4">
							<select
								className="border p-2 rounded-md"
								value={resourceType}
								onChange={(e) => setResourceType(e.target.value as any)}
							>
								<option value="clients">Clients</option>
								<option value="receipts">Receipts</option>
								<option value="issued-documents">Issued Documents</option>
								<option value="suppliers">Suppliers</option>
								<option value="received-documents">Received Documents</option>
							</select>

							{/* ✅ Show date filters only if NOT clients */}
							{resourceType !== "clients" && (
								<>
									<select
										className="border p-2 rounded-md"
										value={reportType}
										onChange={(e) => setReportType(e.target.value as any)}
									>
										<option value="weekly">Weekly</option>
										<option value="monthly">Monthly</option>
									</select>

									<div className="flex items-center gap-2">
										<input
											type="date"
											className="border p-2 rounded-md"
											value={startDate}
											onChange={(e) => setStartDate(e.target.value)}
										/>
										<input
											type="date"
											className="border p-2 rounded-md"
											value={endDate}
											onChange={(e) => setEndDate(e.target.value)}
										/>
									</div>
								</>
							)}

							{/* ✅ Filter UI for clients only */}
							{resourceType === "clients" && (
								<div className="flex border rounded-md p-1 gap-2 bg-gray-50">
									<select
										className="border rounded p-2"
										value={filterField}
										onChange={(e) => setFilterField(e.target.value)}
									>
										{columns.map((col) => (
											<option key={col} value={col}>
												{col}
											</option>
										))}
									</select>
									<input
										type="text"
										placeholder="Search"
										className="border p-2 rounded-md"
										value={filterValue}
										onChange={(e) => setFilterValue(e.target.value)}
									/>
								</div>
							)}
						</div>
					</div>

					{/* Table */}
					<div className="bg-white rounded-lg shadow-sm border">
						{loading && <div className="p-6 text-center">Loading data...</div>}
						{error && (
							<div className="p-6 text-center text-red-600">Error: {error}</div>
						)}
						{!loading && !error && (
							<>
								{paginatedData.length === 0 ? (
									<div className="p-6 text-center text-gray-500">No data.</div>
								) : (
									<div className="overflow-auto">
										<table className="min-w-full divide-y divide-gray-200">
											<thead className="bg-gray-50">
												<tr>
													{columns.map((col) => (
														<th
															key={col}
															className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
														>
															{col}
														</th>
													))}
												</tr>
											</thead>
											<tbody className="bg-white divide-y divide-gray-200">
												{paginatedData.map((row: any, idx: number) => (
													<tr key={idx} className="hover:bg-gray-50">
														{columns.map((col) => (
															<td
																key={`${idx}-${col}`}
																className="px-6 py-4 text-sm text-gray-700"
															>
																{String(row[col] ?? "")}
															</td>
														))}
													</tr>
												))}
											</tbody>
										</table>
									</div>
								)}
							</>
						)}

						{/* ✅ Pagination only for clients */}
						{resourceType === "clients" && (
							<div className="flex justify-between items-center px-6 py-3 border-t bg-gray-50">
								<div className="text-sm text-gray-600">
									Page {page} of {totalPages}
								</div>
								<div className="flex gap-2">
									<button
										className="px-3 py-1 border rounded disabled:opacity-50"
										onClick={() => setPage((p) => Math.max(1, p - 1))}
										disabled={page === 1}
									>
										Prev
									</button>
									<button
										className="px-3 py-1 border rounded disabled:opacity-50"
										onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
										disabled={page === totalPages}
									>
										Next
									</button>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);

	return <div>{desktopView()}</div>;
};

export default Dashboard;
