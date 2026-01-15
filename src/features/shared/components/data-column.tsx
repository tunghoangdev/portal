import type { ColumnDef, Row } from '@tanstack/react-table';
import type { ReactNode } from 'react';
type Column = {
	title: string;
	name: string;
	cell?: (row: any) => ReactNode | string;
	size?: number;
};
export const getColumn = (
	title: string,
	name: string,
	cell?: (row: any) => ReactNode | string,
	size?: number,
): ColumnDef<Row<any>> => {
	return {
		header: title,
		accessorKey: name,
		cell: (info) => (cell ? cell(info) : info.getValue()),
		size: size || 150,
	};
};

// export const userColumns: ColumnDef<Row>[] = [
// 	{
// 		id: "checkbox",
// 		header: ({ table }) => (
// 			<Checkbox
// 				checked={table.getIsAllPageRowsSelected()}
// 				onChange={table.getToggleAllPageRowsSelectedHandler()}
// 				isIndeterminate={table.getIsSomePageRowsSelected()}
// 			/>
// 			// <input
// 			// 	{...{
// 			// 		type: "checkbox",
// 			// 		checked: table.getIsAllPageRowsSelected(),
// 			// 		onChange: table.getToggleAllPageRowsSelectedHandler(),
// 			// 	}}
// 			// />
// 		),
// 		// cell: ({ row }) => (
// 		// 	<input
// 		// 		{...{
// 		// 			type: "checkbox",
// 		// 			checked: row.getIsSelected(),
// 		// 			onChange: row.getToggleSelectedHandler(),
// 		// 		}}
// 		// 		className="cursor-pointer"
// 		// 	/>
// 		// ),
// 		enableSorting: false,
// 		enableHiding: false,
// 		size: 30,
// 	},
// 	{
// 		accessorKey: "name",
// 		header: "Name",
// 		cell: (info) => info.getValue(),
// 		enablePinning: true,
// 	},
// 	{
// 		accessorKey: "email",
// 		header: "Email",
// 		cell: (info) => info.getValue(),
// 		enablePinning: true,
// 	},
// 	{
// 		accessorKey: "role",
// 		header: "Role",
// 		cell: (info) => info.getValue(),
// 		enablePinning: true,
// 	},
// 	{
// 		id: "actions",
// 		header: "Thao tác",
// 		size: 60,
// 		cell: ({ row, table }: any) => {
// 			const original = row.original;
// 			return (
// 				<RowActionsCell row={original} onAction={table.options.onAction} />
// 			);
// 		},
// 		enableSorting: false,
// 	},
// ];
