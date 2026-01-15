import {
	CRUD_ACTIONS,
	DEFAULLT_PAGE_SIZE,
	EXCLUDE_ACTIONS,
	ROLES,
} from '~/constant';
import {
	ActionItem,
	CrudActionType,
	DataTableProps,
	FormModalConfig,
	ToolbarAction,
	ToolbarOptions,
} from '~/types/data-table-type';
import { TItemFormFields } from '~/types/form-field';
import { RevoGrid } from '@revolist/react-datagrid';
import { ColumnPinningState } from '@tanstack/react-table';
import {
	ClipboardEventHandler,
	memo,
	ReactNode,
	use,
	useCallback,
	useEffect,
	useMemo,
	useRef,
} from 'react';
import { RowActionsCell } from './cells';
import { useAuth, usePermissionAction, useRevoSummaryRow } from '~/hooks';
import { useFormModalStore } from '~/stores';
import { ExportExcel } from './export-excel';
import { LoadingDots, NoRowsOverlay, Stack, Typography } from '~/components/ui';
import { FilterTable } from './filter-table';
import { useIsMobile } from '~/hooks/use-mobile';
import ToolbarGrid from './toolbar-grid';
import { makeRevoCellTemplate } from '~/features/shared/common/convert-cell-revo';
import { useRevoInfiniteScroll } from '~/hooks/use-revo-infinite-scroll';
/**
 * Convert TanStack column pinning config sang RevoGrid columns
 * @param columns - danh sách cột ban đầu
 * @param pinningConfig - config pinning kiểu TanStack: { left: string[], right: string[] }
 */
export function applyColumnPinning(
	columns: any[],
	pinningConfig?: { left?: string[]; right?: string[] },
) {
	if (!Array.isArray(columns)) return columns ?? [];

	const DEFAULT_LEFT = ['stt'];
	const DEFAULT_RIGHT = ['actions'];

	const userLeft = pinningConfig?.left ?? [];
	const userRight = pinningConfig?.right ?? [];

	const getKey = (col: any) =>
		String(col.prop ?? col.accessorKey ?? col.id ?? col.name ?? '');

	const colMap = new Map<string, any>();
	for (const c of columns) {
		const key = getKey(c);
		if (key) colMap.set(key, c);
	}

	const pushCol = (arr: any[], key: string, pin?: string) => {
		const col = colMap.get(key);
		if (col && !arr.find((x) => getKey(x) === key)) {
			arr.push({ ...col, pin });
		}
	};

	// 1️⃣ Pinned left
	const pinnedLeft: any[] = [];
	pushCol(pinnedLeft, 'stt', 'colPinStart');
	for (const k of userLeft) pushCol(pinnedLeft, k, 'colPinStart');

	// 2️⃣ Normal
	const leftKeys = new Set([...DEFAULT_LEFT, ...userLeft]);
	const rightKeys = new Set([...DEFAULT_RIGHT, ...userRight]);

	const normal: any[] = [];
	for (const c of columns) {
		const key = getKey(c);
		if (!leftKeys.has(key) && !rightKeys.has(key)) {
			normal.push({ ...c, pin: undefined });
		}
	}

	// 3️⃣ Pinned right
	const pinnedRight: any[] = [];
	for (const k of userRight) pushCol(pinnedRight, k, 'colPinEnd');
	pushCol(pinnedRight, 'actions', 'colPinEnd');

	// 4️⃣ Gắn flag
	const markFlags = (cols: any[], type: 'colPinStart' | 'colPinEnd') => {
		if (!cols.length) return cols;
		const firstKey = getKey(cols[0]);
		const lastKey = getKey(cols[cols.length - 1]);
		return cols.map((c) => ({
			...c,
			firstPinStart: type === 'colPinStart' && getKey(c) === firstKey,
			lastPinStart: type === 'colPinStart' && getKey(c) === lastKey,
			firstPinEnd: type === 'colPinEnd' && getKey(c) === firstKey,
			lastPinEnd: type === 'colPinEnd' && getKey(c) === lastKey,
		}));
	};

	const leftWithFlags = markFlags(pinnedLeft, 'colPinStart');
	const rightWithFlags = markFlags(pinnedRight, 'colPinEnd');

	// 5️⃣ Ghép mảng cuối cùng
	return [...leftWithFlags, ...normal, ...rightWithFlags];
}

interface Props {
	data: any[];
	columns: any[];
	searchValue?: string;
	className?: string;
	loading?: boolean;
	pageSizeOptions?: number[];
	queryKey?: any[];
	enableRowDrag?: boolean;
	topContent?: React.ReactNode;
	bottomContent?: React.ReactNode;
	onRowOrderChange?: (newData: any[]) => void; // Bổ sung callback reorder
	columnPinningConfig?: ColumnPinningState;
	onRowAction?: (type: CrudActionType, row: any) => void;
	toolbar?: ToolbarOptions;
	onAction?: (type: CrudActionType, data?: TItemFormFields) => void;
	customToolbarActions?: React.ReactNode;
	onToolbarAction?: (
		type: ToolbarAction,
		data?: TItemFormFields[] | string,
	) => void;
	renderToolbar?: (props: {
		selectedRows: any[];
		onToolbarAction?: DataTableProps<any>['onToolbarAction'];
	}) => React.ReactNode;
	customActions?: ActionItem<any>[];
	renderNoData?: () => React.ReactNode;
	renderRowActions?: (data?: any) => React.ReactNode;
	total?: number;
	page?: number;
	pageSize?: number;
	onPageChange?: (pageIndex: number) => void;
	onPageSizeChange?: (pageSize: number) => void;
	fetchNextPage?: () => void;
	hasNextPage?: boolean;
	isFetchingNextPage?: boolean;
	// FORM
	formModal?: FormModalConfig<any>;
	filterFields?: any;
	enableRowExpand?: boolean; // Thêm prop này
	renderSubComponent?: (props: { row: any }) => ReactNode;
	groupingColumnId?: string;
}

export const InfiniteRevoGrid = memo(
	({
		data,
		columns,
		onAction,
		onToolbarAction,
		customActions,
		renderToolbar,
		toolbar,
		total,
		loading,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		columnPinningConfig,
		renderRowActions,
		filterFields,
	}: Props) => {
		const { role } = useAuth();
		const isMobile = useIsMobile();
		const { openDetailModal, closeModal } = useFormModalStore();
		const gridRef = useRef<any>(null);
		const rowHeight = 44; // chiều cao 1 dòng (tùy bạn config)
		const headerHeight = 40; // chiều cao header
		const maxHeight = window.innerHeight * 0.8; // 80% chiều cao màn hình

		// useRevoInfiniteScroll(gridRef, {
		// 	fetchNextPage,
		// 	hasNextPage,
		// 	isFetchingNextPage,
		// });

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
		const newColumns = useMemo(() => {
			const baseColumns = columns.filter(
				(col) => !(col.meta as any)?.exportable,
			);

			// Áp dụng cấu hình pinning động
			let pinnedColumns = applyColumnPinning(baseColumns, columnPinningConfig);

			return pinnedColumns.map((col) => {
				if (col.prop === 'actions') {
					return {
						...col,
						cellTemplate: makeRevoCellTemplate({
							render: (row: any) => (
								<RowActionsCell
									row={row}
									onAction={onAction}
									actions={col.meta?.actions || []}
									customActions={customActions}
								/>
							),
						}),
					};
				}
				return col;
			});
		}, [columns, columnPinningConfig]);
		// load more
		// let isLoading = false;
		// let lastTriggerY = 0; // ghi nhớ lần cuối cùng loadMore được gọi
		const gridHeight = useMemo(() => {
			if (!data.length) return maxHeight;
			const total = data.length * rowHeight + headerHeight;
			return Math.min(total, maxHeight);
		}, [data.length]);
		// const ROW_HEIGHT = 40; // hoặc lấy từ config/option
		// const LOAD_THRESHOLD = 3 * ROW_HEIGHT; // load thêm khi còn 3 dòng cuối
		// const handleScroll = (e: any) => {
		// 	const clientHeight = e.target.clientHeight;
		// 	const { dimension, coordinate } = e.detail;
		// 	if (dimension !== 'rgRow') return;
		// 	if (
		// 		coordinate > clientHeight - headerHeight - 100 &&
		// 		!isFetchingNextPage
		// 	) {
		// 		fetchNextPage?.();
		// 		console.log('RUNHEEEE');
		// 	}

		// 	// if (dimension !== 'rgRow' || isLoading) return;

		// 	// const totalRows = data.length; // dataset hiện tại
		// 	// const totalVirtualHeight = totalRows * ROW_HEIGHT;
		// 	// const clientHeight = e.target.clientHeight;

		// 	// const remaining = totalVirtualHeight - (coordinate + clientHeight);

		// 	// // chỉ load khi còn ít hơn ngưỡng và coordinate vượt qua vùng cũ
		// 	// if (remaining < LOAD_THRESHOLD && coordinate > lastTriggerY) {
		// 	// 	isLoading = true;
		// 	// 	lastTriggerY = coordinate;

		// 	// 	console.log('🔥 Load more triggered at:', coordinate);

		// 	// 	// await loadMoreData(); // fetch API thêm dữ liệu

		// 	// 	// chờ render lại rồi mới cho phép load thêm
		// 	// 	requestAnimationFrame(() => {
		// 	// 		isLoading = false;
		// 	// 	});
		// 	// }
		// 	// const { dimension, coordinate } = e.detail;
		// 	// if (dimension === 'rgRow') {
		// 	//   const threshold = gridRef.current.clientHeight - 100;

		// 	//   if (coordinate >= gridRef.current.clientHeight) {
		// 	//     console.log(' gridRef.current.clientHeight', coordinate);
		// 	//     //  loadMoreData();
		// 	//   }
		// 	// }
		// };
		const { summaryRow, hasSummaryRow } = useRevoSummaryRow(
			data,
			newColumns,
			'Tổng cộng: ',
		);
		useEffect(() => {
			const grid = gridRef.current;
			if (!grid || !hasSummaryRow) return;
			grid.pinnedBottomSource = [
				{
					...summaryRow,
				},
			];
			//   grid.addEventListener('scrollviewport', handleScroll);

			return () => {
				grid.pinnedBottomSource = [];
			};
		}, [data, newColumns, summaryRow, hasSummaryRow]);

		const skeletonRows = useMemo(() => {
			if (!loading) return [];
			return Array.from({ length: 20 }).map((_, i) => {
				const row: any = {};
				newColumns.forEach((col: any) => {
					row[col.prop ?? col.accessorKey ?? col.id ?? col.name ?? ''] = '';
				});
				row.__isSkeleton = true;
				return row;
			});
		}, [loading, newColumns]);

		const finalSource = loading ? skeletonRows : data;
		return (
			<div className="relative">
				{renderToolbar ? (
					renderToolbar({
						selectedRows: [],
						onToolbarAction: handleToolbarAction,
					})
				) : (
					<Stack alignItems={'center'} className="gap-x-2.5 mb-4">
						<ToolbarGrid
							onAction={(action: any, data: any) => handleAction(action, data)}
							options={{
								filters: filterFields?.length && (
									<FilterTable fields={filterFields} />
								),

								...toolbar,
							}}
							rows={data}
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
				{/* MAIN TABLE */}
				<RevoGrid
					ref={gridRef}
					source={finalSource}
					columns={newColumns}
					hideAttribution
					theme="material"
					stretch
					readonly
					range={false}
					rowSize={rowHeight}
					useClipboard={false}
					style={{
						height: `${gridHeight}px`,
						maxHeight: '75vh',
					}}
				/>
				{isFetchingNextPage && (
					<div className="absolute -bottom-12 left-1/2 -translate-x-1/2  z-50">
						<LoadingDots />
					</div>
				)}
				{!loading && data.length === 0 && (
					<div className="w-full max-w-[100vw] sticky left-0 right-0 flex items-center justify-start pl-[calc(45vw-var(--sidebar-width))] h-[30vh]">
						<NoRowsOverlay title="Không có dữ liệu" className=" my-5 !w-70" />
					</div>
				)}
			</div>
		);
	},
);
