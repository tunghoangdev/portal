import {
	useState,
	useEffect,
	type CSSProperties,
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
} from '@tanstack/react-table';
import type {
	CrudActionType,
	DataTableProps,
	ToolbarAction,
} from '~/types/data-table-type';
import {
	LoadingDots,
	NoRowsOverlay,
	Pagination,
	Stack,
	Typography,
} from '~/components/ui';
import TableToolbar from './toolbar';
import { useSummaryRow } from '~/hooks/use-summary-row';
import { formatNumber } from '~/utils/formater';
import { Skeleton } from '@heroui/react';
import { useFormModalStore } from '~/stores/form-modal-store';
import {
	CRUD_ACTIONS,
	DEFAULLT_PAGE_SIZE,
	EXCLUDE_ACTIONS,
	ROLES,
} from '~/constant';
import { useAuth, usePermissionAction } from '~/hooks';
import { FilterTable } from './filter-table';
import { cn } from '~/lib/utils';
import { useIsMobile } from '~/hooks/use-mobile';
import { useVirtualizer } from '@tanstack/react-virtual';
import { ExportExcel } from './export-excel';
import { RowActionsCell } from './cells';
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
		position: isPinned ? 'sticky' : 'relative',
		textAlign: isPinned === 'right' ? 'center' : undefined,
		backgroundColor: isPinned ? '#f4f4f4' : undefined,
		zIndex: isPinned ? 1 : 0,
		marginLeft: isPinned === 'right' ? 'auto' : undefined,
		boxShadow: isLastLeftPinnedColumn
			? '-1px 0 4px -4px gray inset'
			: undefined,
	};
};

export const DataTableTanstack = memo(
	<T extends RowData>({
		data,
		columns,
		onAction,
		onToolbarAction,
		customActions,
		renderToolbar,
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
	}: DataTableProps<T>) => {
		const { role } = useAuth();
		const isMobile = useIsMobile();
		const tableContainerRef = useRef<HTMLDivElement>(null);
		const { openDetailModal, closeModal } = useFormModalStore();
		const [rowSelection, setRowSelection] = useState({});
		const [columnPinning, setColumnPinning] = useState(
			columnPinningConfig || { left: [], right: [] },
		);

		const table = useReactTable({
			data,
			columns: columns.filter((col: any) => !col?.meta?.exportable),
			state: {
				columnPinning,
				rowSelection,
			},
			manualPagination: true,
			enableRowSelection: true,
			enableMultiRowSelection: false,
			onRowSelectionChange: setRowSelection,
			onColumnPinningChange: setColumnPinning,
			getCoreRowModel: getCoreRowModel(),
			enableColumnResizing: true,
			columnResizeMode: 'onChange',
			onPaginationChange: (updater) => {
				const newState =
					typeof updater === 'function'
						? updater({ pageIndex: page - 1, pageSize })
						: updater;
				if (newState.pageSize !== pageSize) {
					onPageSizeChange?.(newState.pageSize);
				}
			},
		} as TableOptions<T>);

		const totalWidth = table.getTotalSize();
		const { rows } = table.getRowModel();
		const { summaryRow, hasSummaryRow }: any = useSummaryRow(
			table?.getRowModel()?.rows,
			columns,
		);

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

		const executeAction = useCallback(
			(action: ToolbarAction, data?: any) => {
				if (action === CRUD_ACTIONS.EXPORT_EXCEL) {
					openDetailModal(action, {
						title: 'Xuất file Excel',
						renderContent: () => <ExportExcel columns={columns} />,
						size: 'md',
					});
				} else if (action === 'search') {
					toolbar?.onSearch?.(data);
				} else {
					onAction?.(action as CrudActionType, data);
				}
			},
			[openDetailModal, toolbar, onAction, columns, closeModal],
		);
		const { runAction } = usePermissionAction({
			onAction: executeAction, // khi có quyền thì thực thi
		});

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
				// Nếu role là STAFF và có quyền cụ thể thì check API
				if (role === ROLES.STAFF) {
					runAction(action, data);
					return;
				}
				// Nếu role khác STAFF hoặc action không yêu cầu quyền
				if (EXCLUDE_ACTIONS.includes(action as any) || role !== ROLES.STAFF) {
					executeAction(action as any, data);
				}
			},
			[runAction, executeAction, role],
		);

		const fetchMoreOnBottomReached = useCallback(
			(el?: HTMLDivElement | null) => {
				if (!el || !fetchNextPage || isFetchingNextPage || !hasNextPage) return;
				const { scrollHeight, scrollTop, clientHeight } = el;
				const distanceToBottom = scrollHeight - scrollTop - clientHeight;
				if (distanceToBottom < 400) {
					fetchNextPage();
				}
			},
			[fetchNextPage, hasNextPage, isFetchingNextPage],
		);

		useEffect(() => {
			if (hasNextPage) {
				fetchMoreOnBottomReached(tableContainerRef.current);
			}
		}, [fetchMoreOnBottomReached]);

		const rowVirtualizer = useVirtualizer({
			count: rows.length,
			estimateSize: () => 35,
			getScrollElement: () => tableContainerRef.current,
			overscan: 30,
		});

		const virtualRows = rowVirtualizer.getVirtualItems();
		const showLoading = loading && !isFetchingNextPage && rows.length === 0;

		return (
			<div className="relative">
				{renderToolbar ? (
					renderToolbar({
						selectedRows: [],
						onToolbarAction: handleToolbarAction,
					})
				) : (
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
				<div
					ref={tableContainerRef}
					onScroll={(e) => fetchMoreOnBottomReached(e.currentTarget)}
					style={{
						overflow: 'auto',
						position: 'relative',
						height: '80vh',
					}}
					className="relative rounded-md"
				>
					<div
						className={cn(
							'w-full caption-bottom text-sm border rounded border-[#e5e7eb]',
						)}
						style={{
							display: 'grid',
							position: 'relative',
							width:
								tableContainerRef.current &&
								totalWidth < tableContainerRef.current.clientWidth
									? '100%'
									: `${totalWidth}px`,
							minWidth: '100%',
						}}
					>
						{/* TABLE HEADER */}
						<div
							className="bg-[#f5f5f5]"
							style={{
								display: 'grid',
								position: 'sticky',
								width: '100%',
								top: 0,
								zIndex: 1,
							}}
						>
							<div
								style={{
									display: 'flex',
									width: '100%',
									alignItems: 'center',
									justifyContent: 'between',
								}}
							>
								{table.getHeaderGroups().map((headerGroup) =>
									headerGroup.headers.map((header: any) => {
										const columnSize = header.getSize();
										return (
											<div
												key={header.id}
												className={cn(
													'border-b-2 border-[#e5e7eb] px-1 py-2 text-xs md:text-sm text-default-700 font-semibold',
												)}
												style={{
													...getCommonPinningStyles(header.column),
													// minWidth:
													//   header.column.columnDef.accessorKey === "actions"
													//     ? 80
													//     : columnSize === 150
													//     ? "auto"
													//     : columnSize,
													// width:
													//   header.column.columnDef.accessorKey === "actions"
													//     ? 80
													//     : columnSize === 150
													//     ? "auto"
													//     : columnSize,
													width: columnSize,
													minWidth: columnSize,
													flexGrow: columnSize === 150 ? 1 : 0,
													flexShrink: columnSize === 150 ? 1 : 0,
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
											</div>
										);
									}),
								)}
							</div>
						</div>
						{/* TABLE BODY */}
						<div
							style={{
								display: 'grid',
								position: 'relative',
								height: showLoading
									? 'auto'
									: `${rowVirtualizer.getTotalSize()}px`,
							}}
							className="[&>div:last-child]:border-0 [&>div>div:first-child]:w-8"
						>
							{showLoading ? (
								Array.from({ length: 15 }).map((_, rowIndex) => (
									<div
										key={`skeleton-${rowIndex}`}
										className={cn(
											'w-full',
											rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50',
										)}
										style={{
											display: 'flex',
											position: 'relative',
											width: '100%',
											height: '40px',
											justifyContent: 'between',
										}}
									>
										<div
											className="p-1.5 whitespace-normal w-full"
											style={{ width: '100%', flexGrow: 1 }}
										>
											<Skeleton className="w-full rounded-lg h-full bg-default-500" />
										</div>
									</div>
								))
							) : rows.length === 0 ? (
								<div className="w-full max-w-[100vw] sticky left-0 right-0 flex items-center justify-start pl-[calc(45vw-var(--sidebar-width))] h-[30vh]">
									<NoRowsOverlay
										title="Không có dữ liệu"
										className=" my-5 !w-70"
									/>
								</div>
							) : (
								<>
									{virtualRows.map((virtualRow) => {
										const row = rows[virtualRow.index];
										return (
											<div
												data-index={virtualRow.index}
												ref={(node) => rowVirtualizer.measureElement(node)}
												key={row.id}
												onClick={() => row.toggleSelected()}
												style={{
													display: 'flex',
													position: 'absolute',
													transform: `translateY(${virtualRow.start}px)`,
													width: '100%',
													justifyContent: 'between',
												}}
												className={cn(
													'border-b border-[#e5e5e5] [&>div]:p-1.5 [&>div]:max-w-xs hover:[&>div]:!bg-blue-100',
													virtualRow.index % 2 === 0
														? 'bg-white hover:!bg-blue-100 '
														: 'bg-[#f8f8f8] hover:!bg-blue-100 ',
													row.getIsSelected()
														? '[&>div]:!bg-blue-100 !bg-blue-100'
														: '',
												)}
											>
												{row.getVisibleCells().map((cell) => {
													const colId = cell.column.id;
													const column: any = cell.column;
													const meta = column?.columnDef?.meta;
													const cellContext = cell.getContext();
													const columnWidth = column.getSize();
													return (
														<div
															key={cell.id}
															style={{
																...getCommonPinningStyles(column),

																// width:
																//   colId === "actions"
																//     ? 80
																//     : columnWidth === 150
																//     ? "auto"
																//     : columnWidth,
																// minWidth:
																//   colId === "actions"
																//     ? 80
																//     : columnWidth === 150
																//     ? "auto"
																//     : columnWidth,
																width: columnWidth,
																minWidth: columnWidth,
																flexGrow: columnWidth === 150 ? 1 : 0,
																flexShrink: columnWidth === 150 ? 1 : 0,
																textAlign:
																	colId === 'stt'
																		? 'center'
																		: meta?.align || 'left',
															}}
														>
															<div
																className={cn(
																	'text-xs md:text-[13px] align-middle flex items-center h-full',
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
																			onAction={handleAction}
																			actions={
																				(column.columnDef.meta as any)?.actions
																			}
																			customActions={customActions}
																		/>
																	)
																) : (
																	<div className="whitespace-normal text-xs">
																		{flexRender(
																			column.columnDef.cell,
																			cellContext,
																		)}
																	</div>
																)}
															</div>
														</div>
													);
												})}
											</div>
										);
									})}
								</>
							)}
						</div>
						{hasSummaryRow &&
							table.getRowModel().rows.length > 0 &&
							!loading && (
								<div
									style={{
										display: 'grid',
										position: 'sticky',
										bottom: 0,
										zIndex: 10,
										borderTop: '1px solid #ccc',
										backgroundColor: '#e8e8e8',
									}}
								>
									<div
										className="font-semibold bg-default-50"
										style={{ display: 'flex', width: '100%' }}
									>
										{table.getAllColumns().map((col: any, index) => {
											const meta: any = col.columnDef.meta as {
												key?: string;
												summary?: boolean;
												type?: string;
											};
											const columnSize = col.getSize();
											const cellStyles = {
												...getCommonPinningStyles(col),
												// width: columnSize === 150 ? 'auto' : columnSize,
												// minWidth: columnSize === 150 ? 'auto' : columnSize,
												width: columnSize,
												minWidth: columnSize,
												flexGrow: columnSize === 150 ? 1 : 0,
												flexShrink: columnSize === 150 ? 1 : 0,
												padding: '0.75rem 0.32rem',
											};

											if (index === 1) {
												return (
													<div key={col.id} style={{ ...cellStyles }}>
														Tổng cộng:
													</div>
												);
											}

											if (!meta?.summary) {
												return <div key={col.id} style={{ ...cellStyles }} />;
											}
											const value = summaryRow?.[meta.key ?? col.id];
											return (
												<div
													key={col.id}
													style={{
														...cellStyles,
														textAlign: meta?.align || 'left',
													}}
												>
													<div className="text-left text-xs">
														{meta.type === 'currency'
															? new Intl.NumberFormat('vi-VN').format(
																	Number(value) || 0,
																)
															: meta.type === 'number'
																? formatNumber(value)
																: value}
													</div>
												</div>
											);
										})}
									</div>
								</div>
							)}
					</div>

					{isFetchingNextPage && (
						<div className="w-full my-2.5 h-8 flex items-center justify-center">
							<LoadingDots />
						</div>
					)}
				</div>

				{!fetchNextPage && !hasNextPage && table.getPageCount() > 1 && (
					<Stack
						justifyContent="between"
						alignItems={'center'}
						className="mt-3"
					>
						<span className="ml-4 text-sm">
							Trang {table.getState().pagination.pageIndex + 1} /
							<strong>{table.getPageCount()}</strong>
						</span>

						<Pagination
							isCompact
							showControls
							color="secondary"
							page={table.getState().pagination.pageIndex + 1}
							total={table.getPageCount()}
							onChange={(page: number) => onPageChange?.(page)}
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
