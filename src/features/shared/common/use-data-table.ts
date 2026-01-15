import React, { useState, useEffect, useCallback } from "react";
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

export function useDataTable<T>(
	data: T[],
	columns: ColumnDef<T>[],
	columnPinningConfig: ColumnPinningConfig,
	pageSizeOptions: number[],
) {
	// Load column visibility from localStorage
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

	// Sorting state
	const [sorting, setSorting] = useState<SortingState>([]);

	// Global filter state
	const [globalFilter, setGlobalFilter] = useState("");

	// Page size state
	const [pageSize, setPageSize] = useState(pageSizeOptions[0] || 10);

	// Column pinning state if custom mode
	const [columnPinning, setColumnPinning] = useState<ColumnPinningState>(() => {
		if (columnPinningConfig.mode === "custom") {
			return {
				left: columnPinningConfig.pinnedStart ?? [],
				right: columnPinningConfig.pinnedEnd ?? [],
			};
		}
		return {};
	});

	// React Table instance
	const table = useReactTable({
		data,
		columns,
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

	// Helpers for pinning mode start/end/none
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

	// Move row for drag and drop (reordering)
	const moveRow = useCallback(
		(oldIndex: number, newIndex: number) => {
			if (oldIndex === newIndex) return;
			const rowData = [...data];
			const [moved] = rowData.splice(oldIndex, 1);
			rowData.splice(newIndex, 0, moved);
			// Ideally you should update your data source here, but for demo:
			// just console.log
			console.log("Row moved:", oldIndex, "->", newIndex);
		},
		[data],
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
	};
}
