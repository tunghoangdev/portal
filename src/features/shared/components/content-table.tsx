import {
  TableBody,
  TableCell,
  TableRow,
  NoRowsOverlay,
  Skeleton,
} from "~/components/ui";
import {
  flexRender,
  type Table,
  type Row,
  Column,
  RowModel,
  createColumnHelper,
} from "@tanstack/react-table";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableRow } from "./sortable-row"; // Giữ nguyên component này
import type { CSSProperties } from "react";
import type { ActionItem, CrudActionType } from "~/types/data-table-type";
import { Fragment, useCallback, useMemo, useState } from "react";
import { Icons } from "~/components/icons";
import { Button } from "~/components/ui";
import { formatNumber } from "~/utils/formater";
import { useModal } from "~/hooks";
import { CRUD_ACTION_TO_PERMISSION, CRUD_ACTIONS } from "~/constant";
import { useSummaryRow } from "~/hooks/use-summary-row";

type TableBodyProps<T> = {
  table: Table<T>;
  loading: boolean;
  isFetchingNextPage: boolean;
  groupingColumnId?: string;
  enableRowExpand?: boolean;
  renderSubComponent?: ({ row }: { row: Row<T> }) => React.ReactNode;
  getCommonPinningStyles: <TData extends object>(
    column: Column<TData>
  ) => CSSProperties;
  customActions?: ActionItem<T>[];
  renderRowActions?: (row?: T) => React.ReactNode;
  onAction: (action: CrudActionType, data?: T) => void;
  enableRowDrag?: boolean;
  ref: any; // Ref cho infinite scroll
  hasNextPage: boolean;
  columns: Column<T>[];
};
const columnHelper = createColumnHelper();
export function TableBodyContent<T>({
  table,
  loading,
  isFetchingNextPage,
  groupingColumnId,
  enableRowExpand,
  renderSubComponent,
  getCommonPinningStyles,
  customActions,
  renderRowActions,
  onAction,
  enableRowDrag,
  ref,
  hasNextPage,
  columns,
}: TableBodyProps<T>) {
  const [pendingAction, setPendingAction] = useState<{
    action: any;
    data?: any;
  } | null>(null);
  const { summaryRow, hasSummaryRow }: any = useSummaryRow(
    table.getRowModel().rows,
    columns
  );
  const allColumns: any = useMemo(() => {
    const sttColumn = columnHelper.display({
      id: "stt",
      header: "STT",
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
    const expandColumn = columnHelper.display({
      id: "expand",
      header: () => null,
      cell: ({ row }) =>
        row.getCanExpand() ? (
          <button
            {...{
              onClick: row.getToggleExpandedHandler(),
              style: { cursor: "pointer" },
            }}
          >
            {row.getIsExpanded() ? "➖" : "➕"}
          </button>
        ) : null,
    });
    const finalColumns = [sttColumn, ...columns];

    if (groupingColumnId) {
      const groupingCol: any = columns.find(
        (col: any) => col.accessorKey === groupingColumnId
      );
      if (groupingCol) {
        groupingCol.enableGrouping = true;
      }
    }
    if (enableRowExpand) {
      finalColumns.unshift(expandColumn as any);
    }
  }, [columns, enableRowExpand, groupingColumnId]);
  const { openFormModal } = useModal();
  const totalColSpan = table.getAllColumns().length; // Giả sử đã tính toán ở component cha

  const rowModel: RowModel<T> = groupingColumnId
    ? table.getGroupedRowModel()
    : table.getRowModel();

  const handleAction = useCallback(
    (action: CrudActionType, data?: any) => {
      const requiredPermission =
        CRUD_ACTION_TO_PERMISSION[
          action as keyof typeof CRUD_ACTION_TO_PERMISSION
        ];
      if (requiredPermission || action === CRUD_ACTIONS.DETAIL) {
        setPendingAction({
          action,
          data: {
            ...data,
            permission: requiredPermission,
          },
        });
      }
    },
    [openFormModal, toolbar]
  );
  if (loading && !isFetchingNextPage) {
    return (
      <TableBody>
        {Array.from({ length: 5 }).map((_, rowIndex) => (
          <TableRow
            key={`skeleton-${rowIndex}`}
            className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
          >
            <TableCell
              colSpan={totalColSpan}
              className="p-1.5 whitespace-normal"
            >
              <Skeleton className="w-full rounded-lg h-7 bg-default-500" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    );
  }

  if (rowModel.rows.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell
            colSpan={totalColSpan}
            className="p-4 text-center min-h-60"
          >
            <NoRowsOverlay title="Không có dữ liệu" />
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <SortableContext
      items={table.getRowModel().rows.map((r) => r.id)}
      strategy={verticalListSortingStrategy}
    >
      <TableBody className="[&_tr:last-child]:border-0 **:data-[slot=table-cell]:first:w-8">
        {loading && !isFetchingNextPage ? (
          Array.from({ length: 5 }).map((_, rowIndex) => (
            <TableRow
              key={`skeleton-${rowIndex}`}
              className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
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
            <TableCell
              colSpan={totalColSpan}
              className="p-4 text-center min-h-60"
            >
              <NoRowsOverlay title="Không có dữ liệu" />
            </TableCell>
          </TableRow>
        ) : (
          (groupingColumnId
            ? table.getGroupedRowModel().rows
            : table.getRowModel().rows
          ).map((row, index) => {
            if (groupingColumnId)
              return (
                <Fragment key={row.id}>
                  <TableRow>
                    {row.getVisibleCells().map((cell: any) => {
                      return (
                        <TableCell
                          key={cell.id}
                          // colSpan={
                          //   cell.getIsGrouped() ? cell.colSpan : 1
                          // }
                          style={{
                            ...getCommonPinningStyles(cell.column),
                            // paddingLeft: cell.getIsGrouped()
                            //   ? "0"
                            //   : "1.5rem",
                            // paddingLeft: `${row.depth * 2}rem`,
                            // fontWeight: cell.getIsGrouped()
                            //   ? "bold"
                            //   : "normal",
                            // backgroundColor: cell.getIsGrouped()
                            //   ? "#f0f0f0"
                            //   : "white",
                          }}
                        >
                          {cell.getIsGrouped() ? (
                            <>
                              <Button
                                onClick={row.getToggleExpandedHandler()}
                                variant="light"
                                className="text-xs min-w-0 w-auto px-0"
                                disableRipple
                                startContent={
                                  <Icons.chevronRight
                                    className={`size-4 ${
                                      row.getIsExpanded() ? "rotate-90" : ""
                                    }`}
                                  />
                                }
                              >
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                                ({row.subRows.length})
                              </Button>
                              {/* {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                      )}
                                      ({row.subRows.length}) */}
                            </>
                          ) : (
                            flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                  {row.getIsExpanded() &&
                    row.subRows.map((subRow: any, subRowIndex) => (
                      <SortableRow
                        key={subRow.id}
                        id={subRow.id}
                        row={subRow}
                        customActions={customActions as ActionItem<unknown>[]}
                        renderRowActions={renderRowActions as any}
                        onAction={handleAction}
                        enableRowDrag={enableRowDrag}
                        columns={allColumns}
                        getCommonPinningStyles={getCommonPinningStyles}
                        rowIndex={subRowIndex}
                      />
                    ))}
                </Fragment>
              );

            return (
              <Fragment key={row.id}>
                <SortableRow
                  key={row.id}
                  id={row.id}
                  row={row}
                  customActions={customActions}
                  renderRowActions={renderRowActions}
                  onAction={handleAction}
                  enableRowDrag={enableRowDrag}
                  columns={allColumns}
                  getCommonPinningStyles={getCommonPinningStyles}
                  rowIndex={index}
                />
                {enableRowExpand && row.getIsExpanded() && (
                  <TableRow>
                    <TableCell colSpan={row.getVisibleCells().length}>
                      {renderSubComponent?.({ row })}
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            );
          })
        )}

        {isFetchingNextPage && (
          <TableRow>
            <TableCell colSpan={totalColSpan} className="p-4 text-center">
              <Skeleton className="w-full rounded-lg h-7 bg-default-500">
                Đang tải thêm...
              </Skeleton>
            </TableCell>
          </TableRow>
        )}
        {hasNextPage && !isFetchingNextPage && (
          <TableRow ref={ref}>
            <TableCell colSpan={totalColSpan} className="p-4 text-center" />
          </TableRow>
        )}

        {hasSummaryRow && table.getRowModel().rows.length > 0 && !loading && (
          <TableRow className="font-semibold bg-default-50">
            {table.getAllColumns().map((col: any, index) => {
              const meta = col.columnDef.meta as {
                key?: string;
                summary?: boolean;
                type?: string;
              };
              if (index === 1) {
                return (
                  <TableCell key={col.id} style={getCommonPinningStyles(col)}>
                    Tổng cộng:
                  </TableCell>
                );
              }

              if (!meta?.summary) {
                return (
                  <TableCell key={col.id} style={getCommonPinningStyles(col)} />
                );
              }

              const value = summaryRow?.[meta.key ?? col.id];

              return (
                <TableCell
                  key={col.id}
                  style={getCommonPinningStyles(col)} // Áp dụng style ghim cho ô giá trị tổng hợp
                >
                  {meta.type === "currency"
                    ? new Intl.NumberFormat("vi-VN").format(Number(value) || 0)
                    : meta.type === "number"
                    ? formatNumber(value)
                    : value}
                </TableCell>
              );
            })}
          </TableRow>
        )}
      </TableBody>
    </SortableContext>
  );
}
