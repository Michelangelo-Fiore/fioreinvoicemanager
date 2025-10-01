"use client";
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import {
	/** Handle Fetch Dashboard Details */ handleFetchResource,
} from "./helpers";
import { showOnDesktopOnly } from "@/utils/constants";

dayjs.extend(isoWeek);

/** Dashboard Page */
const Dashboard: React.FC = () => {
	const [data, setData] = useState<any[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	/* UI states */
	const [resourceType, setResourceType] = useState<
		| "expenses"
		| "clients"
		| "receipts"
		| "issued-documents"
		| "suppliers"
		| "received-documents"
	>("expenses"); // default to expenses
	const [reportType, setReportType] = useState<"weekly" | "monthly">("weekly");
	const [startDate, setStartDate] = useState<string>("");
	const [endDate, setEndDate] = useState<string>("");
	const [hasDateField, setHasDateField] = useState<boolean>(false); // only show date inputs if API returns date field
	const [filterField, setFilterField] = useState<string>("");
	const [filterValue, setFilterValue] = useState<string>("");
	const [page, setPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(10);

	/* Helper: compute default ranges */
	const computeDefaultRange = (type: "weekly" | "monthly") => {
		const now = dayjs();
		if (type === "weekly") {
			// ISO week: Monday -> Sunday
			const start = now.startOf("isoWeek");
			const end = now.endOf("isoWeek");
			return {
				start: start.format("YYYY-MM-DD"),
				end: end.format("YYYY-MM-DD"),
			};
		}
		// monthly
		const start = now.startOf("month");
		const end = now.endOf("month");
		return { start: start.format("YYYY-MM-DD"), end: end.format("YYYY-MM-DD") };
	};

	/* Pre-fill default dates on first load and when reportType changes */
	useEffect(() => {
		// only pre-fill when endpoint likely supports date-filtering
		const dateSupported = [
			"expenses",
			"receipts",
			"issued-documents",
			"received-documents",
			"clients",
		];
		if (dateSupported.includes(resourceType)) {
			const { start, end } = computeDefaultRange(reportType);
			setStartDate(start);
			setEndDate(end);
		}
	}, [reportType, resourceType]);

	/* Effect: fetch selected resource */
	useEffect(() => {
		const ac = new AbortController();

		// Build extraParams only when resourceType likely uses date filtering
		const dateSupported = [
			"expenses",
			"receipts",
			"issued-documents",
			"received-documents",
			"clients",
		];

		const extraParams =
			dateSupported.includes(resourceType) && startDate && endDate
				? {
						startDate,
						endDate,
					}
				: undefined;

		// call the generic helper (keeps your pattern)
		handleFetchResource(
			resourceType,
			setData,
			setError,
			setLoading,
			ac.signal,
			extraParams,
		).catch((err) => {
			// preserve console behavior
			console.error("handleFetchResource Error:", err);
		});

		return () => ac.abort();
	}, [resourceType, reportType, startDate, endDate]);

	/* After data loads, decide whether to show date selectors (validate existence of date field) */
	useEffect(() => {
		if (Array.isArray(data) && data.length > 0) {
			setHasDateField(Object.prototype.hasOwnProperty.call(data[0], "date"));
		} else {
			setHasDateField(false);
		}
	}, [data]);

	useEffect(() => {
		setPage(1);
	}, [data, pageSize]);

	/** Derived columns (dynamic) */
	const columns: string[] = data && data.length > 0 ? Object.keys(data[0]) : [];

	/** Ensure a default filter field is set when data loads */
	useEffect(() => {
		if (columns.length > 0 && !filterField) {
			setFilterField(columns[0]);
		}
	}, [columns, filterField]);

	/** Filtering (client-side) */
	const filteredData = useMemo(() => {
		const rows = data.filter((row) => {
			if (!filterField || !filterValue) return true;
			const cell = (row as any)[filterField];
			if (cell === undefined || cell === null) return false;
			return String(cell).toLowerCase().includes(filterValue.toLowerCase());
		});
		return rows;
	}, [data, filterField, filterValue]);

	/** Pagination */
	const totalItems = filteredData.length;
	const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
	const paginatedData = filteredData.slice(
		(page - 1) * pageSize,
		(page - 1) * pageSize + pageSize,
	);

	/** Money columns detection and totals */
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
	const desktopView = () => {
		return (
			<div className={`${showOnDesktopOnly}`}>
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

							{/* Big resource dropdown (only allowed endpoints) */}
							<div className="flex items-center gap-4">
								<select
									className="border p-2 rounded-md"
									value={resourceType}
									onChange={(e) => setResourceType(e.target.value as any)}
									aria-label="Select resource to fetch"
								>
									<option value="expenses">Expenses</option>
									<option value="clients">Clients</option>
									<option value="receipts">Receipts</option>
									<option value="issued-documents">Issued Documents</option>
									<option value="suppliers">Suppliers</option>
									<option value="received-documents">Received Documents</option>
								</select>

								{/* Time filter controls: only show when endpoint supports dates AND API returned date field */}
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
														// prevent start > end
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
														// prevent end < start
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
							</div>
						</div>

						{/* Controls: filter field dropdown + filter input + page size */}
						<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
							<div className="flex items-center gap-3">
								<label className="text-sm">Filter by:</label>
								<select
									className="border p-2 rounded-md"
									value={filterField}
									onChange={(e) => setFilterField(e.target.value)}
									aria-label="Select field to filter"
								>
									{columns.length === 0 && <option value="">No fields</option>}
									{columns.map((col) => (
										<option key={col} value={col}>
											{col}
										</option>
									))}
								</select>
								<input
									type="text"
									placeholder="Type to filter..."
									className="border p-2 rounded-md w-64"
									value={filterValue}
									onChange={(e) => setFilterValue(e.target.value)}
								/>
							</div>

							<div className="flex items-center gap-3">
								<label className="text-sm">Page size:</label>
								<select
									className="border p-2 rounded-md"
									value={pageSize}
									onChange={(e) => setPageSize(Number(e.target.value))}
								>
									<option value={5}>5</option>
									<option value={10}>10</option>
									<option value={20}>20</option>
									<option value={50}>50</option>
								</select>
							</div>
						</div>

						{/* Main content */}
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
								<div className="overflow-auto">
									<table className="min-w-full divide-y divide-gray-200">
										<thead className="bg-gray-50">
											<tr>
												{columns.map((col) => (
													<th
														key={col}
														scope="col"
														className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
													>
														{col}
													</th>
												))}
											</tr>
										</thead>
										<tbody className="bg-white divide-y divide-gray-200">
											{paginatedData.length === 0 ? (
												<tr>
													<td
														colSpan={columns.length || 1}
														className="px-6 py-4 text-sm text-gray-500 text-center"
													>
														No records found.
													</td>
												</tr>
											) : (
												paginatedData.map((row: any, idx: number) => (
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
												))
											)}
										</tbody>

										{/* Totals row for money columns */}
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
							{!loading && !error && (
								<div className="p-4 flex items-center justify-between">
									<div className="text-sm text-gray-600">
										Page {page} of {totalPages} — {totalItems} record
										{totalItems !== 1 ? "s" : ""}
									</div>
									<div className="flex items-center gap-2">
										<button
											className="px-3 py-1 border rounded disabled:opacity-50"
											disabled={page <= 1}
											onClick={() => setPage((p) => Math.max(1, p - 1))}
										>
											Prev
										</button>
										<button
											className="px-3 py-1 border rounded disabled:opacity-50"
											disabled={page >= totalPages}
											onClick={() =>
												setPage((p) => Math.min(totalPages, p + 1))
											}
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
	};

	return <div>{desktopView()}</div>;
};

export default Dashboard;
