import {
	useState,
	useEffect,
	type CSSProperties,
	useMemo,
	useCallback,
	memo,
	useRef,
} from 'react';
import {
	useReactTable,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	flexRender,
	type RowData,
	type TableOptions,
	type Column,
	createColumnHelper,
} from '@tanstack/react-table';

import {
	DndContext,
	closestCenter,
	PointerSensor,
	useSensor,
	useSensors,
	type DragEndEvent,
} from '@dnd-kit/core';
import {
	arrayMove,
	SortableContext,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type {
	CrudActionType,
	DataTableProps,
	ToolbarAction,
} from '~/types/data-table-type';
import { SortableRow } from './sortable-row';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '~/components/ui/table';
import { NoRowsOverlay, Pagination, Stack, Typography } from '~/components/ui';
import TableToolbar from './toolbar';
import { useSummaryRow } from '~/hooks/use-summary-row';
import { formatNumber } from '~/utils/formater';
import { calcTotalPage } from '~/utils/util';
import { Skeleton } from '@heroui/react';
import { useInView } from 'react-intersection-observer';
import { exportToExcel } from '~/utils/export';
import { exportSchema } from '~/schema-validations';
import { useFormModalStore } from '~/stores/form-modal-store';
import {
	CRUD_ACTION_TO_PERMISSION,
	DEFAULLT_PAGE_SIZE,
	EXCLUDE_ACTIONS,
	ROLES,
} from '~/constant';
import { useCrud } from '~/hooks/use-crud-v2';
import { API_ENDPOINTS } from '~/constant/api-endpoints';
import { useAuth } from '~/hooks';
import { FilterTable } from './filter-table';
import { cn } from '~/lib/utils';
import { useIsMobile } from '~/hooks/use-mobile';
const getCommonPinningStyles = <TData extends object>(
	column: Column<TData>,
): CSSProperties => {
	const isPinned = column.getIsPinned();
	const isLastLeftPinnedColumn =
		isPinned === 'left' && column?.getIsLastColumn('left');
	const isFirstLeftPinnedColumn =
		isPinned === 'left' && column?.getIsFirstColumn('left');

	return {
		left:
			isPinned === 'left'
				? isFirstLeftPinnedColumn
					? '-1px'
					: `calc(${column.getStart('left')}px - 5px)`
				: undefined,
		right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
		// opacity: isPinned ? 1 : 1, // Làm mờ nhẹ cột ghim
		position: isPinned ? 'sticky' : 'relative',
		// width: column.getSize(),
		textAlign: isPinned === 'right' ? 'center' : undefined,
		backgroundColor: isPinned ? '#f4f4f4' : undefined,
		zIndex: isPinned ? 1 : 0,
		// boxShadow: isLastLeftPinnedColumn
		//   ? "0px 0px 4px rgba(0, 0, 0, 0.2)"
		//   : undefined,
		// borderRight: isPinned ? "1px solid #ddd " : "",
		// borderLeft: isPinned ? "1px solid #ddd" : "",
		boxShadow: isLastLeftPinnedColumn
			? '-1px 0 4px -4px gray inset'
			: // : isFirstRightPinnedColumn
				// ? "-4px 0 4px -4px gray inset"
				undefined,
	};
};

const columnHelper = createColumnHelper();

export const DataTable = memo(
	<T extends RowData>({
		data,
		columns,
		onAction,
		onToolbarAction,
		customActions,
		renderToolbar,
		enableRowDrag,
		onRowOrderChange,
		toolbar,
		onPageChange,
		total,
		loading,
		page = 0,
		pageSize = DEFAULLT_PAGE_SIZE,
		onPageSizeChange,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		columnPinningConfig,
		renderRowActions,
		filterFields,
		className,
		customToolbarActions,
	}: DataTableProps<T>) => {
		const { idForm, role } = useAuth();
		const isMobile = useIsMobile();
		const rootRef = useRef(null);

		const { openFormModal, closeModal } = useFormModalStore();
		const [pendingAction, setPendingAction] = useState<{
			action: any;
			data?: any;
		} | null>(null);

		// const { periodDate } = useCommon();
		// const { setData } = useCommonStore();
		// const { data: defaultReport } = useCommonData(
		//   "periodList",
		//   API_ENDPOINTS.common.getDateRange,
		//   {
		//     fetchOnInit: !periodDate,
		//     data: {
		//       id: 4,
		//     },
		//   }
		// );
		const queryAction = {
			idForm,
			permission: pendingAction?.data?.permission,
			action: pendingAction?.action,
		};
		const { getAll } = useCrud(
			[API_ENDPOINTS.permission.checkPermissionButton, queryAction],
			{
				id_form: idForm,
				id_button: pendingAction?.data?.permission,
			},
			{
				enabled: !!pendingAction?.data?.permission && !!idForm,
				staleTime: 1,
			},
		);
		const { data: accessAction, isFetching }: any = getAll();
		// const { getAll: getAllExport } = useCrud(
		// 	queryKey|| [],
		// 	{
		// 		id_form: idForm,
		// 		id_button: pendingAction?.data?.permission,
		// 	},
		// 	{
		// 		enabled: !!pendingAction?.data?.permission && !!idForm,
		// 		staleTime: 1,
		// 	},
		// );
		// const { data: accessAction, isFetching }: any = getAll();

		const [rowSelection, setRowSelection] = useState<Record<string, boolean>>(
			{},
		);
		const [columnPinning, setColumnPinning] = useState(
			columnPinningConfig || { left: [], right: [] },
		);
		const { ref, inView } = useInView({
			threshold: 0,
			skip: loading,
			root: rootRef.current,
		});

		const allColumns: any = useMemo(() => {
			const sttColumn = columnHelper.display({
				id: 'stt',
				header: 'STT',
				cell: (props) => {
					return props.row.index + 1;
				},
				size: 50,
				minSize: 50,
				maxSize: 50,
				enableSorting: false,
				enableHiding: false,
				enableResizing: false,
			});
			const visibleColumns = columns.filter(
				(col) => !(col.meta as any)?.exportable,
			);
			return [sttColumn, ...visibleColumns];
		}, [columns]);

		const table = useReactTable({
			data,
			columns: allColumns,
			state: {
				pagination: {
					pageIndex: page,
					pageSize,
				},
				rowSelection,
				columnPinning,
			},
			// columnResizeMode: "onChange",
			pageCount: calcTotalPage(total || 1, pageSize),
			manualPagination: true,
			onRowSelectionChange: setRowSelection,
			onColumnPinningChange: setColumnPinning,
			getCoreRowModel: getCoreRowModel(),
			getFilteredRowModel: getFilteredRowModel(),
			getSortedRowModel: getSortedRowModel(),
			// getPaginationRowModel: getPaginationRowModel(),
			enableRowSelection: true,
			onPaginationChange: (updater) => {
				const newState =
					typeof updater === 'function'
						? updater({ pageIndex: page - 1, pageSize })
						: updater;
				// console.log('newState', newState);

				// const currentPage = newState.pageIndex + 1;
				// onPageChange?.(currentPage);
				// if (currentPage !== page) {
				//  onPageChange?.(currentPage);
				// }
				if (newState.pageSize !== pageSize) {
					onPageSizeChange?.(newState.pageSize);
				}
			},
		} as TableOptions<T>);

		const visibleColumnCount = table.getAllColumns().length;
		const totalColSpan =
			visibleColumnCount +
			(enableRowDrag ? 1 : 0) +
			(table.getIsSomeRowsSelected() ? 1 : 0);
		const { summaryRow, hasSummaryRow }: any = useSummaryRow(
			table?.getRowModel()?.rows,
			columns,
		);
		const selectedRows = table
			.getSelectedRowModel()
			.flatRows.map((row) => row.original);

		// Dnd-kit sensors
		const sensors = useSensors(useSensor(PointerSensor));

		useEffect(() => {
			if (columnPinningConfig) {
				const uniqueLeftPinned = new Set<string>();
				uniqueLeftPinned.add('stt');
				if (!isMobile)
					(columnPinningConfig.left || []).forEach((colId) =>
						uniqueLeftPinned.add(colId),
					);
				const uniqueRightPinned = new Set<string>();
				(columnPinningConfig.right || []).forEach((colId) =>
					uniqueRightPinned.add(colId),
				);
				uniqueRightPinned.add('actions');
				setColumnPinning({
					left: Array.from(uniqueLeftPinned),
					right: Array.from(uniqueRightPinned),
				});
			}
		}, [columnPinningConfig, isMobile]);

		useEffect(() => {
			if (inView && hasNextPage && !isFetchingNextPage && !loading) {
				fetchNextPage?.();
			}
		}, [inView, hasNextPage, isFetchingNextPage, fetchNextPage, loading]);

		useEffect(() => {
			if (pendingAction && !isFetching) {
				if (accessAction?.status === 1) {
					const { data, action } = pendingAction;
					executeAction(action, data);
				}
				setPendingAction(null);
			}
		}, [pendingAction, accessAction, isFetching]);
		// useEffect(() => {
		// 	if (selectedKeys.size > 0 && !selectedKeys.has(allOption.value))
		// 		resetSelection();
		// }, [pathname, resetSelection]);
		// useEffect(() => {
		//   if (defaultReport && typeof defaultReport === "string") {
		//     const [period_start, period_end] = defaultReport.split("-");
		//     setData("periodDate", {
		//       from_date: formatDate(period_start),
		//       to_date: formatDate(period_end),
		//     });
		//   }
		// }, [defaultReport]);

		// Xử lý drag end
		function handleDragEnd(event: DragEndEvent) {
			if (!enableRowDrag) return;
			const { active, over } = event;
			if (over && active.id !== over.id) {
				const oldIndex = table
					.getRowModel()
					.rows.findIndex((r) => r.id === active.id);
				const newIndex = table
					.getRowModel()
					.rows.findIndex((r) => r.id === over.id);
				if (oldIndex !== -1 && newIndex !== -1) {
					const newRowOrder = arrayMove(data, oldIndex, newIndex);
					onRowOrderChange?.(newRowOrder);
				}
			}
		}
		const executeAction = useCallback(
			(action: ToolbarAction, data?: any) => {
				if (action === 'export-excel') {
					openFormModal(action, {
						exportSchema,
						title: 'Xuất file Excel',
						onExportSubmit: handleExportFile,
						onFormSubmitSuccess: closeModal,
					});
				} else if (action === 'search') {
					toolbar?.onSearch?.(data);
				} else {
					onAction?.(action as CrudActionType, data);
				}
			},
			[
				openFormModal,
				toolbar,
				exportSchema,
				onAction,
				accessAction,
				closeModal,
			],
		);
		const handleExportFile = useCallback(
			(values: any) => {
				const { fileName } = values || {};
				if (fileName && data?.length) {
					exportToExcel(data, columns, fileName);
				}
			},
			[columns, data],
		);

		const handleToolbarAction = useCallback(
			(action: ToolbarAction, data?: any) => {
				if (action === 'search') {
					toolbar?.onSearch?.(data);
				} else {
					onToolbarAction?.(action, data);
				}
			},
			[toolbar],
		);

		const handleAction = useCallback(
			(action: CrudActionType, data?: any) => {
				const requiredPermission =
					CRUD_ACTION_TO_PERMISSION[
						action as keyof typeof CRUD_ACTION_TO_PERMISSION
					];
				if (requiredPermission && role === ROLES.STAFF) {
					setPendingAction({
						action,
						data: {
							...data,
							permission: requiredPermission,
						},
					});
				}
				if (EXCLUDE_ACTIONS.includes(action as any) || role !== ROLES.STAFF) {
					executeAction(action as any, data);
				}
			},
			[executeAction],
		);

		return (
			<div className="relative">
				{renderToolbar ? (
					renderToolbar({ selectedRows, onToolbarAction: handleToolbarAction })
				) : (
					<Stack alignItems={'center'} className="gap-x-2.5 mb-4">
						<TableToolbar
							table={table}
							onAction={(action: any, data: any) => handleAction(action, data)}
							options={{
								filters: filterFields?.length && (
									<FilterTable fields={filterFields} />
								),
								// startContent: filterFields?.length ? (
								// 	<FilterTable fields={filterFields} />
								// ) : null,
								...toolbar,
							}}
						/>
					</Stack>
				)}
				{total && total > 0 && !isMobile ? (
					<Stack
						justifyContent="between"
						alignItems={'center'}
						className="w-full my-5"
					>
						<Typography variant="body2r" className="text-default-700 leading-0">
							Tổng cộng: <b>{total} dòng</b>
						</Typography>
					</Stack>
				) : null}

				{/* Table */}
				<DndContext
					sensors={sensors}
					collisionDetection={closestCenter}
					onDragEnd={handleDragEnd}
				>
					<Table
						className={cn('w-full border rounded border-[#e5e7eb]')}
						classNames={{
							container: cn(
								'md:min-h-[300px] pb-5 custom-scrollbar relative rounded-md max-h-[80vh]',
								className,
							),
						}}
						ref={rootRef}
						// style={{ tableLayout: "fixed", width: "100%" }}
					>
						<TableHeader className="bg-[#f5f5f5]">
							<TableRow>
								{table.getHeaderGroups().map((headerGroup) =>
									headerGroup.headers.map((header: any) => {
										return (
											<TableHead
												key={header.id}
												style={{
													...getCommonPinningStyles(header.column),
													fontSize: isMobile ? 12 : 14,
													minWidth:
														header.getSize() === 150
															? 'auto'
															: isMobile
																? header.getSize() * 0.75
																: header.getSize(),
													width:
														header.getSize() === 150
															? 'auto'
															: isMobile
																? header.getSize() * 0.75
																: header.getSize(),
													textAlign:
														header.column.columnDef?.meta?.align || 'left',
												}}
											>
												{header.isPlaceholder
													? null
													: flexRender(
															header.column.columnDef.header,
															header.getContext(),
														)}
											</TableHead>
										);
									}),
								)}
							</TableRow>
						</TableHeader>

						<SortableContext
							items={table.getRowModel().rows.map((r) => r.id)}
							strategy={verticalListSortingStrategy}
						>
							<TableBody className="[&_tr:last-child]:border-0 **:data-[slot=table-cell]:first:w-8">
								{loading && !isFetchingNextPage ? (
									Array.from({ length: 5 }).map((_, rowIndex) => (
										<TableRow
											key={`skeleton-${rowIndex}`}
											className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
										>
											<TableCell
												colSpan={totalColSpan}
												className="p-1.5 whitespace-normal"
											>
												<Skeleton className="w-full rounded-lg h-7 bg-default-500" />
											</TableCell>
										</TableRow>
									))
								) : table.getRowModel().rows.length === 0 ? (
									<TableRow>
										<TableCell colSpan={totalColSpan} className="p-4 min-h-60">
											<NoRowsOverlay
												title="Không có dữ liệu"
												className="items-start text-center pl-[calc(50vw-var(--sidebar-width))] [&>svg]:ml-6 my-5"
											/>
										</TableCell>
									</TableRow>
								) : (
									table.getRowModel().rows.map((row, index) => {
										return (
											<SortableRow
												key={row.id}
												id={row.id}
												row={row}
												rowSelection={rowSelection}
												setRowSelection={setRowSelection}
												customActions={customActions}
												renderRowActions={renderRowActions}
												onAction={handleAction}
												enableRowDrag={enableRowDrag}
												columns={allColumns}
												getCommonPinningStyles={getCommonPinningStyles}
												rowIndex={index}
											/>
										);
									})
								)}

								{isFetchingNextPage && (
									<TableRow>
										<TableCell
											colSpan={totalColSpan}
											className="p-4 text-center"
										>
											<Skeleton className="w-full rounded-lg h-7 bg-default-500">
												Đang tải thêm...
											</Skeleton>
										</TableCell>
									</TableRow>
								)}
								{hasNextPage && !isFetchingNextPage && (
									<TableRow ref={ref}>
										<TableCell
											colSpan={totalColSpan}
											className="p-4 text-center"
										/>
									</TableRow>
								)}

								{hasSummaryRow &&
									table.getRowModel().rows.length > 0 &&
									!loading && (
										<TableRow className="font-semibold bg-default-50">
											{table.getAllColumns().map((col: any, index) => {
												const meta = col.columnDef.meta as {
													key?: string;
													summary?: boolean;
													type?: string;
												};
												if (index === 1) {
													return (
														<TableCell
															key={col.id}
															style={getCommonPinningStyles(col)}
														>
															Tổng cộng:
														</TableCell>
													);
												}

												if (!meta?.summary) {
													return (
														<TableCell
															key={col.id}
															style={getCommonPinningStyles(col)}
														/>
													);
												}

												const value = summaryRow?.[meta.key ?? col.id];

												return (
													<TableCell
														key={col.id}
														style={getCommonPinningStyles(col)} // Áp dụng style ghim cho ô giá trị tổng hợp
													>
														<div className="text-left">
															{meta.type === 'currency'
																? new Intl.NumberFormat('vi-VN').format(
																		Number(value) || 0,
																	)
																: meta.type === 'number'
																	? formatNumber(value)
																	: value}
														</div>
													</TableCell>
												);
											})}
										</TableRow>
									)}
							</TableBody>
						</SortableContext>
					</Table>
				</DndContext>

				{/* Pagination */}
				{!fetchNextPage && !hasNextPage && table.getPageCount() > 1 && (
					<Stack
						justifyContent="between"
						alignItems={'center'}
						className="mt-3"
					>
						<span className="ml-4 text-sm">
							Trang {table.getState().pagination.pageIndex + 1} /{' '}
							<strong>{table.getPageCount()}</strong>
						</span>{' '}
						<Pagination
							isCompact
							showControls
							color="secondary"
							page={table.getState().pagination.pageIndex + 1} // Đảm bảo page hiển thị đúng
							total={table.getPageCount()}
							onChange={(page) => onPageChange?.(page)}
							size="sm"
							radius="sm"
							classNames={{
								next: 'data-[disabled=true]:text-default-600',
								prev: 'data-[disabled=true]:text-default-600',
								cursor: 'font-semibold',
								item: 'font-medium',
							}}
						/>
					</Stack>
				)}
			</div>
		);
	},
);
