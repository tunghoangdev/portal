import {
  type Column,
  type ColumnDef,
  flexRender,
  type Row,
  type RowData,
} from "@tanstack/react-table";
import { RowActionsCell } from "./cells/row-actions-cell";
import { Checkbox, cn } from "@heroui/react";
import { TableCell, TableRow } from "~/components/ui/table";
import type { ActionItem, CrudActionType } from "~/types/data-table-type";
import { type CSSProperties, forwardRef } from "react";
import type { TItemFormFields } from "~/types/form-field";

interface CustomRowProps<T> {
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
  enableRowDrag?: boolean; // Giữ lại nếu muốn kiểm soát class cursor, nhưng logic kéo thả đã bị loại bỏ
  groupingColumnId?: string;
  getCommonPinningStyles: <TData extends object>(
    column: Column<TData>
  ) => CSSProperties;
  // Style từ Virtualizer
  style?: React.CSSProperties;
}

export const CustomRow = forwardRef(
  <T extends RowData>(
    {
      // id, // Không cần thiết nếu không dùng useSortable
      row,
      rowIndex,
      onAction,
      columns,
      enableRowDrag, // Giữ lại để kiểm soát cursor nếu cần
      groupingColumnId,
      getCommonPinningStyles,
      customActions,
      renderRowActions,
      style: virtualizationStyle, // Style từ Virtualizer
    }: CustomRowProps<T>,
    // Ref được truyền từ bên ngoài (Virtualizer)
    forwardedRef: React.ForwardedRef<HTMLTableRowElement>
  ) => {
    // ❌ Loại bỏ logic useSortable

    return (
      <TableRow
        // 💡 Gán trực tiếp forwardedRef
        ref={forwardedRef}
        // 💡 Gán trực tiếp style từ Virtualizer
        style={virtualizationStyle}
        // Thêm data-index để virtualizer có thể đo đúng phần tử
        data-index={rowIndex}
        className={cn(
          {
            // 💡 Giữ lại class cursor-move chỉ để hiển thị nếu cần (nhưng không có chức năng kéo thả)
            "hover:bg-gray-50 cursor-pointer": enableRowDrag,
          },
          // Lớp CSS gốc - đã loại bỏ truncate để hỗ trợ auto height
          "[&>td]:border-b [&>td]:border-[#e5e5e5] [&>td]:p-1.5 [&>td]:max-w-xs [&>td]:whitespace-normal",
          rowIndex % 2 === 0 ? "bg-white" : "bg-[#f8f8f8]"
        )}
      >
        {/* Logic render các cột giữ nguyên */}
        {columns.map((col: any) => {
          const cell: any = row
            .getVisibleCells()
            .find((c: any) => c.column.id === (col.id || col.accessorKey));

          // Xử lý cột STT
          if (col.id === "stt" || col.accessorKey === "stt") {
            return (
              <TableCell
                key={col.id || col.accessorKey}
                className="text-center justify-center"
<<<<<<< HEAD
                style={getCommonPinningStyles(cell?.column)}
=======
                style={{
                  ...getCommonPinningStyles(cell?.column),
                  width: cell?.column.getSize(),
                }}
>>>>>>> main
              >
                {groupingColumnId
                  ? rowIndex + 1
                  : flexRender(cell?.column.columnDef.cell, cell?.getContext())}
              </TableCell>
            );
          }

          // Xử lý cột Select
          if (!cell && col.id === "select")
            return (
              <TableCell
                key={col.id || col.accessorKey}
                style={getCommonPinningStyles(col as Column<any>)}
                className="p-2 z-10"
              >
                <Checkbox
                  type="checkbox"
                  checked={row.getIsSelected()}
                  onChange={row.getToggleSelectedHandler()}
                  aria-label={`Select row ${row.id}`}
                />
              </TableCell>
            );

          // Xử lý cột Grouping
          if (groupingColumnId === col.accessorKey) {
            return (
              <TableCell
                key={col.id || col.accessorKey}
                className="text-xs md:text-[13px] p-1 md:p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]"
                style={getCommonPinningStyles(col as Column<any>)}
              />
            );
          }

          // Các cột dữ liệu và cột Actions
          return (
            <TableCell
              key={col.id || col.accessorKey}
              className="text-xs md:text-[13px] p-1 md:p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]"
              style={getCommonPinningStyles(cell?.column)}
            >
              {col.accessorKey === "actions" || col.id === "actions" ? (
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
  }
);
