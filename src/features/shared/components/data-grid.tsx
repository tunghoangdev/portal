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
	flexRender,
	type RowData,
	type TableOptions,
	type Column,
	createColumnHelper,
	ColumnMeta,
} from '@tanstack/react-table';
// 🚀 Thư viện Virtualization
import { useVirtualizer } from '@tanstack/react-virtual';

import type {
	CrudActionType,
	DataTableProps,
	ToolbarAction,
} from '~/types/data-table-type';
import {
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '~/components/ui/table';
import {
	LoadingDots,
	NoRowsOverlay,
	Pagination,
	Stack,
	Typography,
} from '~/components/ui';
import TableToolbar from './toolbar';
import { useSummaryRow } from '~/hooks/use-summary-row';
import { Skeleton } from '@heroui/react'; // Đảm bảo đã import
import { exportToExcel } from '~/utils/export';

const columnHelper = createColumnHelper();
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
import { RowActionsCell } from './cells';
import { exportSchema } from '~/schema-validations';
import { formatNumber } from '~/utils/formater';

/**
 * Tối ưu hóa: Loại bỏ boxShadow (có thể gây lag) để ưu tiên hiệu suất cuộn.
 */
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
		// page = 0,
		// pageSize = DEFAULLT_PAGE_SIZE,
		// onPageSizeChange,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		columnPinningConfig,
		renderRowActions,
		filterFields,
		// className,
		// customToolbarActions,
	}: DataTableProps<T>) => {
		const { idForm, role } = useAuth();
		const isMobile = useIsMobile();
		const tableContainerRef = useRef<HTMLDivElement>(null); // Ref cho container cuộn

		const { openFormModal } = useFormModalStore();
		const [pendingAction, setPendingAction] = useState<{
			action: any;
			data?: any;
		} | null>(null);

		// -----------------------------------------------------
		// LOGIC CHECK PERMISSION & ACTIONS (Không thay đổi)
		// -----------------------------------------------------

		const queryAction = useMemo(
			() => ({
				idForm,
				permission: pendingAction?.data?.permission,
				action: pendingAction?.action,
			}),
			[idForm, pendingAction],
		);

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

		const [columnPinning, setColumnPinning] = useState(
			columnPinningConfig || { left: [], right: [] },
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

		const executeAction = useCallback(
			(action: ToolbarAction, data?: any) => {
				if (action === 'export-excel') {
					openFormModal(action, {
						exportSchema,
						title: 'Xuất file Excel',
						onExportSubmit: handleExportFile,
					});
				} else if (action === 'search') {
					toolbar?.onSearch?.(data);
				} else {
					onAction?.(action as CrudActionType, data);
				}
			},
			[openFormModal, toolbar, onAction, handleExportFile],
		);

		useEffect(() => {
			if (pendingAction && !isFetching) {
				if (accessAction?.status === 1) {
					const { data, action } = pendingAction;
					executeAction(action, data);
				}
				setPendingAction(null);
			}
		}, [pendingAction, accessAction, isFetching, executeAction]);

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
			[executeAction, role],
		);

		const handleToolbarAction = useCallback(
			(action: ToolbarAction, data?: any) => {
				if (action === 'search') {
					toolbar?.onSearch?.(data);
				} else {
					onToolbarAction?.(action, data);
				}
			},
			[toolbar, onToolbarAction],
		);
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
		// -----------------------------------------------------
		const table = useReactTable({
			data,
			columns: allColumns,
			state: {
				// pagination: {
				//   pageIndex: page,
				//   pageSize,
				// },
				// rowSelection,
				columnPinning,
			},
			//   pageCount: calcTotalPage(total || 1, pageSize),
			manualPagination: true,
			//   onRowSelectionChange: setRowSelection,
			onColumnPinningChange: setColumnPinning,
			getCoreRowModel: getCoreRowModel(),
			//   getFilteredRowModel: getFilteredRowModel(),
			//   getSortedRowModel: getSortedRowModel(),
			//   enableRowSelection: true,
			//   onPaginationChange: (updater) => {
			//     const newState =
			//       typeof updater === "function"
			//         ? updater({ pageIndex: page, pageSize })
			//         : updater;
			//     if (newState.pageSize !== pageSize) {
			//       onPageSizeChange?.(newState.pageSize);
			//     }
			//     // Giả định onPageChange muốn index 0-based
			//     if (newState.pageIndex !== page) {
			//       onPageChange?.(newState.pageIndex);
			//     }
			//   },
		} as TableOptions<T>);

		const visibleColumnCount = table.getAllColumns().length;
		const { rows } = table.getRowModel();
		// Tính tổng colspan cẩn thận (không cần cột Actions vì nó đã là một cột thông thường)
		const totalColSpan = visibleColumnCount + (enableRowDrag ? 1 : 0);

		const { summaryRow, hasSummaryRow }: any = useSummaryRow(rows, columns);
		// const selectedRows = table
		// 	.getSelectedRowModel()
		// 	.flatRows.map((row) => row.original);

		// -----------------------------------------------------
		// LOGIC INFINITE SCROLLING & VIRTUALIZATION
		// -----------------------------------------------------

		// Tối ưu hóa: Bọc hàm này trong useCallback
		const fetchMoreOnBottomReached = useCallback(
			(el?: HTMLDivElement | null) => {
				if (!el || !fetchNextPage || isFetchingNextPage || !hasNextPage) return;

				const { scrollHeight, scrollTop, clientHeight } = el;
				const distanceToBottom = scrollHeight - scrollTop - clientHeight;

				// Gần đến đáy thì load thêm
				if (distanceToBottom < 400) {
					fetchNextPage();
				}
			},
			[fetchNextPage, hasNextPage, isFetchingNextPage],
		);

		// Lắng nghe cuộn
		useEffect(() => {
			const el = tableContainerRef.current;
			if (!el) return;

			let timeout: NodeJS.Timeout;
			const handleScroll = () => {
				if (timeout) clearTimeout(timeout);
				timeout = setTimeout(() => fetchMoreOnBottomReached(el), 120); // debounce 120ms
			};

			el.addEventListener('scroll', handleScroll);
			return () => {
				el.removeEventListener('scroll', handleScroll);
				clearTimeout(timeout);
			};
		}, [fetchMoreOnBottomReached]);
		// Virtualizer Hook
		const rowVirtualizer = useVirtualizer({
			count: rows.length,
			estimateSize: () => 35,
			getScrollElement: () => tableContainerRef.current,
			// measureElement:
			// 	typeof window !== 'undefined' &&
			// 	navigator.userAgent.indexOf('Firefox') === -1
			// 		? (element) => element?.getBoundingClientRect().height
			// 		: undefined,
			overscan: 30,
		});

		const virtualRows = rowVirtualizer.getVirtualItems();

		// -----------------------------------------------------
		// RENDER
		// -----------------------------------------------------

		return (
			<div className="relative">
				<Stack alignItems={'center'} className="gap-x-2.5 mb-4">
					<TableToolbar
						table={table}
						onAction={(action: any, data: any) => handleAction(action, data)}
						options={{
							filters: filterFields?.length && (
								<FilterTable fields={filterFields} />
							),
							...toolbar,
						}}
					/>
				</Stack>
				{/* TỔNG DÒNG (Không thay đổi) */}
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

				{/* CONTAINER CUỘN VÀ TABLE */}
				<div
					ref={tableContainerRef}
					onScroll={(e) => fetchMoreOnBottomReached(e.currentTarget)}
					style={{
						overflow: 'auto',
						position: 'relative',
						height: '80vh',
					}}
					className="custom-scrollbar relative rounded-md"
				>
					<table
						className={cn(
							'w-full caption-bottom text-sm border rounded border-[#e5e7eb]',
						)}
						style={{ display: 'grid', position: 'relative' }}
					>
						{/* TABLE HEADER (Không thay đổi) */}
						<TableHeader
							className="bg-[#f5f5f5]"
							style={{
								display: 'grid',
								position: 'sticky',
								top: 0,
								zIndex: 1,
							}}
						>
							<TableRow
								style={{ display: 'flex', width: '100%', alignItems: 'center' }}
							>
								{table.getHeaderGroups().map((headerGroup) =>
									headerGroup.headers.map((header: any) => {
										// Tối ưu hóa width cho mobile (logic của bạn)
										const columnSize = header.getSize();
										const finalWidth =
											columnSize === 150
												? 'auto'
												: isMobile
													? columnSize * 0.75
													: columnSize;

										return (
											<TableHead
												key={header.id}
												style={{
													...getCommonPinningStyles(header.column),
													fontSize: isMobile ? 12 : 14,
													minWidth:
														header.column.columnDef.accessorKey === 'actions'
															? 80
															: columnSize,
													width:
														header.column.columnDef.accessorKey === 'actions'
															? 80
															: columnSize,
													textAlign:
														header.column.columnDef?.meta?.align || 'left',
													display: 'flex',
													alignItems: 'center',
													justifyContent:
														header.column.columnDef?.meta?.align === 'right'
															? 'flex-end'
															: header.column.columnDef?.meta?.align ===
																	'center'
																? 'center'
																: 'flex-start',
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

						{/* TABLE BODY */}
						<tbody
							style={{
								display: 'grid',
								position: 'relative',
								height: `${rowVirtualizer.getTotalSize()}px`,
							}}
							className="[&_tr:last-child]:border-0 **:data-[slot=table-cell]:first:w-8"
						>
							{loading && !isFetchingNextPage && rows.length === 0 ? (
								Array.from({ length: 10 }).map((_, rowIndex) => (
									<TableRow
										key={`skeleton-${rowIndex}`}
										className={cn(
											'w-full',
											rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50',
										)}
									>
										<TableCell
											colSpan={totalColSpan}
											className="p-1.5 whitespace-normal w-full"
										>
											<Skeleton className="w-full rounded-lg h-7 bg-default-500" />
										</TableCell>
									</TableRow>
								))
							) : rows.length === 0 ? (
								<TableRow className="w-full">
									<TableCell colSpan={totalColSpan} className="p-4 min-h-60">
										<NoRowsOverlay
											title="Không có dữ liệu"
											className="items-start text-center pl-[calc(50vw-var(--sidebar-width))] [&>svg]:ml-6 my-5"
										/>
									</TableCell>
								</TableRow>
							) : (
								<>
									{virtualRows.map((virtualRow) => {
										const row = rows[virtualRow.index];
										return (
											<tr
												data-index={virtualRow.index}
												ref={(node) => rowVirtualizer.measureElement(node)}
												key={row.id}
												style={{
													display: 'flex',
													position: 'absolute',
													transform: `translateY(${virtualRow.start}px)`,
													width: '100%',
												}}
												className={cn(
													'[&>td]:border-b [&>td]:border-[#e5e5e5] [&>td]:p-1.5 [&>td]:max-w-xs [&>td]:whitespace-normal',
													virtualRow.index % 2 === 0
														? 'bg-white'
														: 'bg-[#f8f8f8]',
												)}
											>
												{row.getVisibleCells().map((cell) => {
													const colId = cell.column.id;
													const column: any = cell.column;
													const meta = column?.columnDef?.meta;
													const cellContext = cell.getContext();
													const columnWidth = column.getSize();
													return (
														<td
															key={cell.id}
															style={{
																...getCommonPinningStyles(column),
																width: colId === 'actions' ? 80 : columnWidth,
																minWidth:
																	colId === 'actions' ? 80 : columnWidth,
																textAlign:
																	colId === 'stt'
																		? 'center'
																		: meta?.align || 'left',
																verticalAlign: 'middle',
																overflow: 'hidden',
															}}
														>
															<div
																className={cn(
																	'text-xs md:text-[13px] align-middle flex items-center',
																	'overflow-hidden whitespace-nowrap text-ellipsis',
																	colId === 'stt'
																		? 'justify-center'
																		: meta?.align === 'right'
																			? 'justify-end'
																			: meta?.align === 'center'
																				? 'justify-center'
																				: 'justify-start',
																)}
															>
																{colId === 'actions' ? (
																	renderRowActions ? (
																		renderRowActions?.(row.original)
																	) : (
																		<RowActionsCell
																			row={row.original}
																			onAction={onAction}
																			actions={
																				(column.columnDef.meta as any)?.actions
																			}
																			customActions={customActions}
																		/>
																	)
																) : (
																	flexRender(column.columnDef.cell, cellContext)
																)}
															</div>
														</td>
													);
												})}
											</tr>
										);
									})}

									{/* {virtualRows.length > 0 &&
										virtualRows[virtualRows.length - 1].index <
											rows.length - 1 &&
										Array.from({ length: 3 }).map((_, i) => (
											<TableRow
												key={`temp-skeleton-${i}`}
												// style={{
												// 	position: 'absolute',
												// 	top: `${
												// 		rowVirtualizer.getTotalSize() - (3 - i) * 45
												// 	}px`,
												// 	width: '100%',
												// 	display: 'flex',
												// }}
											>
												<TableCell colSpan={totalColSpan} className="p-2">
													<Skeleton className="w-full rounded-lg h-6 bg-default-500" />
												</TableCell>
											</TableRow>
										))} */}
								</>
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
													style={getCommonPinningStyles(col)}
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
						</tbody>
					</table>
					{isFetchingNextPage && (
						<div className="w-full my-2.5 h-8 flex items-center justify-center">
							<LoadingDots />
						</div>
					)}
				</div>

				{/* PAGINATION (Không thay đổi) */}
				{/* {!fetchNextPage && !hasNextPage && table.getPageCount() > 1 && (
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
							page={table.getState().pagination.pageIndex + 1}
							total={table.getPageCount()}
							onChange={(page: number) => onPageChange?.(page - 1)}
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
				)} */}
			</div>
		);
	},
);
