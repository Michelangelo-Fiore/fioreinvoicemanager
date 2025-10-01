import React from "react";

interface RecordsSelectProps {
	selectedRecord: string;
	onChange: (value: string) => void;
}

const RecordsSelect: React.FC<RecordsSelectProps> = ({
	selectedRecord,
	onChange,
}) => {
	return (
		<div className="mb-4">
			<label htmlFor="records" className="mr-2 font-semibold">
				Select Record:
			</label>
			<select
				id="records"
				value={selectedRecord}
				onChange={(e) => onChange(e.target.value)}
				className="border px-2 py-1 rounded"
			>
				<option value="expenses">Expenses</option> {/* default */}
				<option value="suppliers">Suppliers</option>
				<option value="receipts">Receipts</option>
				<option value="clients">Clients</option>
				<option value="issued_documents">Issued Documents</option>
				<option value="received_documents">Received Documents</option>
			</select>
		</div>
	);
};

export default RecordsSelect;
