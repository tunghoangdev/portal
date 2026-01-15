import React from 'react';

interface StatusCellProps {
	status: string;
}

export function StatusCell({ status }: StatusCellProps) {
	const color =
		status === 'active'
			? 'text-green-600'
			: status === 'inactive'
				? 'text-red-600'
				: 'text-gray-600';

	return (
		<span className={`font-semibold ${color}`}>{status.toUpperCase()}</span>
	);
}
