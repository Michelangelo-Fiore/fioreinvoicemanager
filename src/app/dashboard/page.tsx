/* Dashboard.tsx
   CHANGES:
   - Replaced JSON dump with a TailwindCSS table showcasing all data points.
   - Added big resource type dropdown (Clients / Products / Receipts) above the table that fetches the selected resource.
   - Added table header dropdown to choose which data point (column) to filter on + filter input.
   - Added client-side pagination and page size control.
   - Preserved existing comments, console.logs and structure. Followed existing comment styles.
*/

"use client";
import { useEffect, useState } from "react";
import {
	/** Handle Fetch Dashboard Details */
	handleFetchResource,
} from "./helpers";
import { showOnDesktopOnly } from "@/utils/constants";

/** Dashboard Page */
const Dashboard: React.FC = () => {
	// preserve original states
	const [data, setData] = useState<any[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	/* UI states */
	const [resourceType, setResourceType] = useState<
		"clients" | "products" | "receipts"
	>("clients");
	const [filterField, setFilterField] = useState<string>("");
	const [filterValue, setFilterValue] = useState<string>("");
	const [page, setPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(10);

	/* Effect: fetch selected resource */
	useEffect(() => {
		const ac = new AbortController();

		// fetch selected resource
		handleFetchResource(
			resourceType,
			setData,
			setError,
			setLoading,
			ac.signal,
		).catch((err) => {
			// preserve console behavior
			console.error("handleFetchResource Error:", err);
		});

		return () => ac.abort();
	}, [resourceType]);

	/* Reset pagination when data or pageSize changes */
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [columns]);

	/** Filtering (client-side) */
	const filteredData = data.filter((row) => {
		if (!filterField || !filterValue) return true;
		const cell = (row as any)[filterField];
		if (cell === undefined || cell === null) return false;
		return String(cell).toLowerCase().includes(filterValue.toLowerCase());
	});

	/** Pagination */
	const totalItems = filteredData.length;
	const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
	const paginatedData = filteredData.slice(
		(page - 1) * pageSize,
		(page - 1) * pageSize + pageSize,
	);

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

							{/* Big resource dropdown and login button */}
							<div className="flex items-center gap-4">
								{/* Big dropdown that when switched fetches data from the API */}
								<select
									className="border p-2 rounded-md"
									value={resourceType}
									onChange={(e) => setResourceType(e.target.value as any)}
									aria-label="Select resource to fetch"
								>
									<option value="clients">Clients</option>
									<option value="products">Products</option>
									<option value="receipts">Receipts</option>
								</select>
							</div>
						</div>

						{/* Controls: filter field dropdown + filter input + page size */}
						<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
							<div className="flex items-center gap-3">
								<label className="text-sm">Filter by:</label>

								{/* Table header dropdown to choose which data point to filter */}
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

								{/* Filter input */}
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
							{/* Loading / Error */}
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

							{/* Table */}
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
																{/* show primitive or JSON for objects */}
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
									</table>
								</div>
							)}

							{/* Pagination footer */}
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

	return (
		<div>
			{desktopView()}
			{/* {tabletView()}
			{mobileView()} */}
		</div>
	);
};

export default Dashboard;
