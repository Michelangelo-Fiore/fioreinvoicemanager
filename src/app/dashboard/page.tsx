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
	const [hasDateField, setHasDateField] = useState<boolean>(false);
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

	/* Always pre-fill default dates for ALL resources */
	useEffect(() => {
		const { start, end } = computeDefaultRange(reportType);
		setStartDate(start);
		setEndDate(end);
	}, [reportType, resourceType]);

	/* Fetch resource */
	useEffect(() => {
		const ac = new AbortController();

		handleFetchResource(
			resourceType,
			setData,
			setError,
			setLoading,
			ac.signal,
			{
				startDate,
				endDate,
				page,
				pageSize,
				filterField,
				filterValue,
			},
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

	/* Check if any row has date fields */
	useEffect(() => {
		if (Array.isArray(data) && data.length > 0) {
			const firstRow = data[0];
			setHasDateField("date" in firstRow || "created_at" in firstRow);
		} else {
			setHasDateField(true);
		}
	}, [data]);

	useEffect(() => {
		setPage(1);
	}, [data, pageSize]);

	/** Derived columns */
	const columns: string[] = data && data.length > 0 ? Object.keys(data[0]) : [];

	/** Default filter field */
	useEffect(() => {
		if (columns.length > 0 && !filterField) {
			setFilterField(columns[0]);
		}
	}, [columns, filterField]);

	/** Filtering (local) */
	const filteredData = useMemo(() => {
		if (!Array.isArray(data)) return [];
		return data.filter((row) => {
			if (!filterField || !filterValue) return true;
			const cell = (row as any)[filterField];
			if (cell === undefined || cell === null) return false;
			return String(cell).toLowerCase().includes(filterValue.toLowerCase());
		});
	}, [data, filterField, filterValue]);

	/** Pagination (local, fallback if BE doesn’t paginate) */
	const totalItems = filteredData.length;
	const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
	const paginatedData = filteredData.slice(
		(page - 1) * pageSize,
		(page - 1) * pageSize + pageSize,
	);

	/** Detect money fields */
	const moneyColumnKeys = useMemo(() => {
		const candidates = [
			"total",
			"amount",
			"price",
			"cost",
			"value",
			"amount_gross",
			"amount_net",
		];
		return columns.filter((c) =>
			candidates.some((s) => c.toLowerCase().includes(s)),
		);
	}, [columns]);

	const totalsByColumn = useMemo(() => {
		const totals: Record<string, number> = {};
		moneyColumnKeys.forEach((key) => (totals[key] = 0));
		filteredData.forEach((row) => {
			moneyColumnKeys.forEach((key) => {
				const val = row?.[key];
				const num =
					typeof val === "number"
						? val
						: Number(String(val ?? "").replace(/[^0-9.-]+/g, ""));
				if (!Number.isNaN(num)) totals[key] += num;
			});
		});
		return totals;
	}, [filteredData, moneyColumnKeys]);

	/** Desktop View */
	const desktopView = () => (
		<div>
			<div className="text-black font-LibreFranklin px-6 py-8 min-h-screen">
				<div className="max-w-6xl mx-auto">
					{/* Page Header */}
					<div className="flex items-center justify-between mb-6">
						<div>
							<p className="font-semibold text-4xl">
								Dashboard - Fiore Invoice Manager 📊
							</p>
							<p className="text-sm text-gray-600 mt-1">
								{resourceType.charAt(0).toUpperCase() + resourceType.slice(1)}
								{" • "}
								{totalItems} record{totalItems !== 1 ? "s" : ""}
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

							{hasDateField && (
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
										<div className="flex flex-col">
											<label className="text-xs font-medium">From</label>
											<input
												type="date"
												className="border p-2 rounded-md"
												value={startDate}
												onChange={(e) => {
													const newStart = e.target.value;
													if (
														endDate &&
														dayjs(newStart).isAfter(dayjs(endDate))
													) {
														setEndDate(newStart);
													}
													setStartDate(newStart);
												}}
												max={endDate || undefined}
											/>
										</div>
										<div className="flex flex-col">
											<label className="text-xs font-medium">To</label>
											<input
												type="date"
												className="border p-2 rounded-md"
												value={endDate}
												onChange={(e) => {
													const newEnd = e.target.value;
													if (
														startDate &&
														dayjs(newEnd).isBefore(dayjs(startDate))
													) {
														setStartDate(newEnd);
													}
													setEndDate(newEnd);
												}}
												min={startDate || undefined}
											/>
										</div>
									</div>
								</>
							)}

							{/* Filter input */}
							<input
								type="text"
								placeholder={`Filter by ${filterField || "field"}`}
								className="border p-2 rounded-md"
								value={filterValue}
								onChange={(e) => setFilterValue(e.target.value)}
							/>
						</div>
					</div>

					{/* Table */}
					<div className="bg-white rounded-lg shadow-sm border">
						{loading && (
							<div className="p-6 text-center">
								<p className="text-lg">Loading data...</p>
							</div>
						)}
						{error && (
							<div className="p-6 text-center text-red-600">
								<p>Error: {error}</p>
							</div>
						)}
						{!loading && !error && (
							<>
								{paginatedData.length === 0 ? (
									<div className="p-6 text-center text-gray-500">
										<p>No data for selected date range.</p>
									</div>
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
																className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
															>
																{typeof row[col] === "object" ? (
																	<pre className="whitespace-pre-wrap max-w-md overflow-auto text-xs">
																		{JSON.stringify(row[col], null, 2)}
																	</pre>
																) : (
																	String(row[col] ?? "")
																)}
															</td>
														))}
													</tr>
												))}
											</tbody>
											{moneyColumnKeys.length > 0 && (
												<tfoot>
													<tr className="bg-gray-50">
														{columns.map((col) => (
															<td
																key={`total-${col}`}
																className="px-6 py-3 text-left text-xs font-medium text-gray-700"
															>
																{moneyColumnKeys.includes(col)
																	? Number.isFinite(totalsByColumn[col])
																		? totalsByColumn[col].toFixed(2)
																		: "0.00"
																	: ""}
															</td>
														))}
													</tr>
												</tfoot>
											)}
										</table>
									</div>
								)}
							</>
						)}

						{/* Pagination controls */}
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
					</div>
				</div>
			</div>
		</div>
	);

	return <div>{desktopView()}</div>;
};

export default Dashboard;
