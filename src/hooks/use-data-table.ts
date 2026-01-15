// hooks/useDataTable.ts
import { useState, useEffect, useCallback } from "react";
import {
	useReactTable,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type ColumnDef,
	type VisibilityState,
	type SortingState,
	type ColumnPinningState,
} from "@tanstack/react-table";

interface ColumnPinningConfig {
	mode: "none" | "start" | "end" | "custom";
	pinnedStart?: string[];
	pinnedEnd?: string[];
}

interface UseDataTableProps<T> {
	data: T[];
	columns: ColumnDef<T>[];
	columnPinningConfig: ColumnPinningConfig;
	pageSizeOptions: number[];
	enableRowDrag?: boolean;
}

export function useDataTable<T>({
	data,
	columns,
	columnPinningConfig,
	pageSizeOptions,
	enableRowDrag = false,
}: UseDataTableProps<T>) {
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
		() => {
			try {
				const saved = localStorage.getItem("table-columns");
				return saved ? JSON.parse(saved) : {};
			} catch {
				return {};
			}
		},
	);

	useEffect(() => {
		localStorage.setItem("table-columns", JSON.stringify(columnVisibility));
	}, [columnVisibility]);

	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState("");
	const [pageSize, setPageSize] = useState(pageSizeOptions[0] || 10);
	const [columnPinning, setColumnPinning] = useState<ColumnPinningState>(() => {
		if (columnPinningConfig.mode === "custom") {
			return {
				left: columnPinningConfig.pinnedStart ?? [],
				right: columnPinningConfig.pinnedEnd ?? [],
			};
		}
		return {};
	});

	const [internalData, setInternalData] = useState(data);

	const moveRow = useCallback(
		(oldIndex: number, newIndex: number) => {
			if (!enableRowDrag || oldIndex === newIndex) return;
			const rowData = [...internalData];
			const [moved] = rowData.splice(oldIndex, 1);
			rowData.splice(newIndex, 0, moved);
			setInternalData(rowData);
		},
		[internalData, enableRowDrag],
	);

	const normalizedColumns = columns.map((col: any, index) => {
		if (!col.id) {
			if (typeof col.accessorKey === "string") {
				return { ...col, id: col.accessorKey };
			}
			throw new Error(
				`Column at index ${index} is missing 'id' and 'accessorKey'. Please provide at least one.`,
			);
		}
		return col;
	});

	const table = useReactTable({
		data: internalData,
		columns: normalizedColumns,
		state: {
			globalFilter,
			columnVisibility,
			sorting,
			columnPinning,
			pagination: {
				pageSize,
				pageIndex: 0,
			},
		},
		onGlobalFilterChange: setGlobalFilter,
		onColumnVisibilityChange: setColumnVisibility,
		onSortingChange: setSorting,
		onColumnPinningChange: setColumnPinning,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		enableMultiSort: true,
		manualPagination: false,
		debugTable: false,
	});

	const isPinned = useCallback(
		(colId: string, position: "start" | "end") => {
			if (columnPinningConfig.mode === "start") {
				return position === "start";
			}
			if (columnPinningConfig.mode === "end") {
				return position === "end";
			}
			if (columnPinningConfig.mode === "custom") {
				if (position === "start") return columnPinning.left?.includes(colId);
				if (position === "end") return columnPinning.right?.includes(colId);
			}
			return false;
		},
		[columnPinningConfig.mode, columnPinning],
	);

	return {
		table,
		globalFilter,
		setGlobalFilter,
		pageSize,
		setPageSize,
		isPinned,
		moveRow,
		columnVisibility,
		setColumnVisibility,
		sorting,
		setSorting,
		enableRowDrag,
		data: internalData,
	};
}
