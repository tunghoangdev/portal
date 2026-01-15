import {
	type Column,
	type ColumnDef,
	flexRender,
	type Row,
	type RowData,
} from '@tanstack/react-table';
import { RowActionsCell } from './cells/row-actions-cell';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Checkbox, cn } from '@heroui/react';
import { TableCell, TableRow } from '~/components/ui/table';
import type { ActionItem, CrudActionType } from '~/types/data-table-type';
import { type CSSProperties, forwardRef } from 'react'; // 💡 Import forwardRef và CSSProperties
import type { TItemFormFields } from '~/types/form-field';

interface SortableRowProps<T> {
	id: string;
	row: Row<T>;
	rowIndex: number;
	rowSelection?: Record<string, boolean>;
	setRowSelection?: React.Dispatch<
		React.SetStateAction<Record<string, boolean>>
	>;
	customActions?: ActionItem<T>[];
	onAction?: (type: CrudActionType, row?: TItemFormFields) => void;
	renderRowActions?: (row?: T) => React.ReactNode;
	columns: ColumnDef<T>[];
	enableRowDrag?: boolean;
	groupingColumnId?: string;
	getCommonPinningStyles: <TData extends object>(
		column: Column<TData>,
	) => CSSProperties;
	// 💡 Thêm style prop vào đây, nó sẽ được hợp nhất với dnd-kit style
	style?: React.CSSProperties;
}

// 💡 1. Sử dụng forwardRef và định nghĩa kiểu prop cho nó
export const SortableRow = forwardRef(
	<T extends RowData>(
		{
			id,
			row,
			rowIndex,
			onAction,
			columns,
			enableRowDrag,
			groupingColumnId,
			getCommonPinningStyles,
			customActions,
			renderRowActions,
			// 💡 Lấy prop style từ ngoài vào (dùng cho Virtualizer)
			style: virtualizationStyle,
		}: SortableRowProps<T>,
		// 💡 2. Định nghĩa ref được truyền từ bên ngoài
		forwardedRef: React.ForwardedRef<HTMLTableRowElement>,
	) => {
		const {
			attributes,
			listeners,
			setNodeRef,
			transform,
			transition,
			isDragging,
		} = useSortable({ id });

		// 💡 3. Kết hợp dnd-kit ref và ref từ bên ngoài
		// Đây là cách kết hợp ref cho component có cả dnd-kit và forwardRef
		const mergedRef = (node: HTMLTableRowElement) => {
			// Gán ref cho dnd-kit
			setNodeRef(node);

			// Gán ref được truyền từ bên ngoài (Virtualizer)
			if (typeof forwardedRef === 'function') {
				forwardedRef(node);
			} else if (forwardedRef) {
				forwardedRef.current = node;
			}
		};

		// 💡 4. Kết hợp styles: dnd-kit styles > virtualization styles
		const dndStyle: CSSProperties = {
			transform: CSS.Transform.toString(transform),
			transition,
			backgroundColor: isDragging ? '#e2e8f0' : undefined,
			// 💡 Đặt style của Virtualization trước
			...virtualizationStyle,
		};

		const finalStyle: CSSProperties = {
			...dndStyle,
			// Dnd-kit styles (transform/transition) ghi đè nếu trùng
		};

		const listenersV = enableRowDrag ? listeners : {};

		return (
			<TableRow
				// 💡 5. Gán mergedRef
				ref={mergedRef}
				style={finalStyle}
				{...attributes}
				{...listenersV}
				className={cn(
					{
						'hover:bg-gray-50 cursor-move': enableRowDrag,
					},
					// Lớp CSS gốc
					'[&>td]:border-b [&>td]:border-[#e5e5e5] [&>td]:p-1.5 [&>td]:max-w-xs [&>td]:truncate',
					rowIndex % 2 === 0 ? 'bg-white' : 'bg-[#f8f8f8]',
				)}
			>
				{/* Các cột (phần còn lại của logic render giữ nguyên) */}
				{columns.map((col: any) => {
					const cell: any = row
						.getVisibleCells()
						.find((c: any) => c.column.id === (col.id || col.accessorKey));

					// Xử lý cột STT
					if (col.id === 'stt' || col.accessorKey === 'stt') {
						return (
							<TableCell
								key={col.id || col.accessorKey}
								className="text-center justify-center"
								style={getCommonPinningStyles(cell.column)}
							>
								{groupingColumnId
									? rowIndex
									: flexRender(cell.column.columnDef.cell, cell.getContext())}
							</TableCell>
						);
					}

					// Xử lý cột Select
					if (!cell && col.id === 'select')
						return (
							<TableCell
								key={col.id || col.accessorKey}
								// 💡 Dùng getCommonPinningStyles cho cột ghim (select thường là ghim trái)
								style={getCommonPinningStyles(col)}
								className="p-2 z-10" // Loại bỏ sticky left và background-color mặc định để dùng pinning style
							>
								<Checkbox
									type="checkbox"
									checked={row.getIsSelected()}
									onChange={() => row.getToggleSelectedHandler()}
									aria-label={`Select row ${row.id}`}
								/>
							</TableCell>
						);

					// Xử lý cột Grouping (nếu có)
					if (groupingColumnId === col.accessorKey) {
						return (
							<TableCell
								key={col.id || col.accessorKey}
								className="text-xs md:text-[13px] p-1 md:p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]"
								style={getCommonPinningStyles(cell.column)}
							/>
						);
					}

					// Các cột dữ liệu và cột Actions
					return (
						<TableCell
							key={col.id || col.accessorKey}
							className="text-xs md:text-[13px] p-1 md:p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]"
							style={getCommonPinningStyles(cell.column)}
						>
							{col.accessorKey === 'actions' || col.id === 'actions' ? (
								renderRowActions ? (
									renderRowActions?.(row.original)
								) : (
									<RowActionsCell
										row={row.original}
										onAction={onAction}
										actions={col.meta?.actions}
										customActions={customActions}
									/>
								)
							) : cell ? (
								flexRender(cell.column.columnDef.cell, cell.getContext())
							) : null}
						</TableCell>
					);
				})}
			</TableRow>
		);
	},
) as <T extends RowData>(
	props: SortableRowProps<T> & { ref?: React.Ref<HTMLTableRowElement> },
) => React.ReactElement; // 💡 Ép kiểu để giữ generic T và props
