"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { GeneralNonAuthRoutes } from "../../utils/urls"; // ✅ import routes
import { handleFetchResource } from "./helpers"; // fetcher

dayjs.extend(isoWeek);

/** Dashboard Page */
const Dashboard: React.FC = () => {
	const router = useRouter();

	const [data, setData] = useState<any[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	/* UI states */
	const [resourceType, setResourceType] = useState<
		| "clients"
		| "suppliers"
		| "receipts"
		| "issued-documents"
		| "received-documents"
	>("clients");
	const [reportType, setReportType] = useState<"weekly" | "monthly">("weekly");
	const [startDate, setStartDate] = useState<string>("");
	const [endDate, setEndDate] = useState<string>("");
	const [filterField, setFilterField] = useState<string>("");
	const [filterValue, setFilterValue] = useState<string>("");
	const [page, setPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(10);

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

	useEffect(() => {
		const ac = new AbortController();
		const params =
			resourceType === "clients"
				? { page, pageSize, filterField, filterValue }
				: { startDate, endDate, page, pageSize, filterField, filterValue };

		handleFetchResource(
			resourceType,
			setData,
			setError,
			setLoading,
			ac.signal,
			params,
		).catch((err) => console.error("handleFetchResource Error:", err));

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

	const columns: string[] = data && data.length > 0 ? Object.keys(data[0]) : [];

	useEffect(() => {
		if (columns.length > 0 && !filterField) {
			setFilterField(columns[0]);
		}
	}, [columns, filterField]);

	const filteredData = useMemo(() => {
		if (!Array.isArray(data)) return [];
		return data.filter((row) => {
			if (!filterField || !filterValue) return true;
			const cell = (row as any)[filterField];
			if (cell === undefined || cell === null) return false;
			return String(cell).toLowerCase().includes(filterValue.toLowerCase());
		});
	}, [data, filterField, filterValue]);

	const totalItems = filteredData.length;
	const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
	const paginatedData = filteredData.slice(
		(page - 1) * pageSize,
		(page - 1) * pageSize + pageSize,
	);

	const desktopView = () => (
		<div className="text-black font-LibreFranklin px-6 py-8 min-h-screen">
			<div className="max-w-6xl mx-auto">
				{/* Header with Logout */}
				<div className="flex items-center justify-between mb-6">
					<h1 className="font-semibold text-4xl text-left">
						Dashboard - Fiore Invoice Manager 📊
					</h1>
					<button
						className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
						onClick={() => router.push(GeneralNonAuthRoutes.landingPage)}
					>
						Logout
					</button>
				</div>

				{/* Resource Selector + Filters */}
				<div className="flex items-center mb-6 gap-6">
					{/* Switch Data Type */}
					<div className="flex flex-col gap-1">
						<label className="text-sm font-medium text-gray-700">
							Switch Data Type
						</label>
						<select
							className="border p-2 rounded-md"
							value={resourceType}
							onChange={(e) => setResourceType(e.target.value as any)}
						>
							<option value="clients">Clients</option>
							<option value="suppliers">Suppliers</option>
							<option value="receipts">Receipts</option>
							<option value="issued-documents">Issued Documents</option>
							<option value="received-documents">Received Documents</option>
						</select>
					</div>

					{/* Filter UI */}
					<div className="flex flex-col gap-1">
						<label className="text-sm font-medium text-gray-700">
							Filter By{" "}
							{resourceType
								.replace(/-/g, " ")
								.replace(/\b\w/g, (l) => l.toUpperCase())}{" "}
							Details
						</label>
						<div className="flex gap-2 bg-gray-50">
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
								placeholder={
									filterField ? `Search by ${filterField}` : "Search"
								}
								className="border p-2 rounded-md"
								value={filterValue}
								onChange={(e) => setFilterValue(e.target.value)}
							/>
						</div>
					</div>

					{/* Weekly/Monthly + Date Range */}
					{resourceType !== "clients" && (
						<div className="flex items-center gap-4">
							<div className="flex flex-col gap-1">
								<label className="text-sm font-medium text-gray-700">
									Report Type
								</label>
								<select
									className="border p-2 rounded-md"
									value={reportType}
									onChange={(e) => setReportType(e.target.value as any)}
								>
									<option value="weekly">Weekly</option>
									<option value="monthly">Monthly</option>
								</select>
							</div>

							<div className="flex flex-col gap-1">
								<label className="text-sm font-medium text-gray-700">
									Range From
								</label>
								<input
									type="date"
									className="border p-2 rounded-md"
									value={startDate}
									onChange={(e) => setStartDate(e.target.value)}
								/>
							</div>

							<div className="flex flex-col gap-1">
								<label className="text-sm font-medium text-gray-700">To</label>
								<input
									type="date"
									className="border p-2 rounded-md"
									value={endDate}
									onChange={(e) => setEndDate(e.target.value)}
								/>
							</div>
						</div>
					)}
				</div>

				{/* Table Info & View Many */}
				<div className="mb-2">
					<div className="text-sm text-gray-600">Total Items: {totalItems}</div>
					<div className="flex items-center gap-2 mt-1">
						<span className="text-sm text-gray-600">View:</span>
						<select
							className="border rounded p-1 text-sm"
							value={pageSize}
							onChange={(e) => {
								setPageSize(Number(e.target.value));
								setPage(1);
							}}
						>
							<option value={5}>5</option>
							<option value={10}>10</option>
							<option value={20}>20</option>
							<option value={30}>30</option>
						</select>
						<span className="text-sm text-gray-600">
							Page {page} of {totalPages}
						</span>
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
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
													#
												</th>
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
													<td className="px-6 py-4 text-sm text-gray-700">
														{(page - 1) * pageSize + idx + 1}
													</td>
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

					{/* Pagination for all modules */}
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
	);

	return <div>{desktopView()}</div>;
};

export default Dashboard;
