import React from "react";

interface DateFilterProps {
	startDate: string;
	endDate: string;
	onStartDateChange: (value: string) => void;
	onEndDateChange: (value: string) => void;
}

const DateFilter: React.FC<DateFilterProps> = ({
	startDate,
	endDate,
	onStartDateChange,
	onEndDateChange,
}) => {
	return (
		<div className="mb-4 flex gap-4 items-center">
			<div>
				<label htmlFor="fromDate" className="block font-semibold mb-1">
					From:
				</label>
				<input
					type="date"
					id="fromDate"
					value={startDate}
					onChange={(e) => onStartDateChange(e.target.value)}
					className="border px-2 py-1 rounded"
				/>
			</div>
			<div>
				<label htmlFor="toDate" className="block font-semibold mb-1">
					To:
				</label>
				<input
					type="date"
					id="toDate"
					value={endDate}
					onChange={(e) => onEndDateChange(e.target.value)}
					className="border px-2 py-1 rounded"
				/>
			</div>
		</div>
	);
};

export default DateFilter;
