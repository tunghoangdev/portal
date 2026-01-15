import { TableHeader, TableRow, TableHead } from "~/components/ui/table";
import { flexRender, type Table, type Column } from "@tanstack/react-table";
import type { CSSProperties } from "react";

type TableHeaderProps<TData> = {
  table: Table<TData>;
  getCommonPinningStyles: (column: Column<TData>) => CSSProperties;
};

export function TopContentTable<TData>({
  table,
  getCommonPinningStyles,
}: TableHeaderProps<TData>) {
  return (
    <TableHeader className="bg-[#f5f5f5]">
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header: any) => (
            <TableHead
              key={header.id}
              colSpan={header.colSpan}
              style={{
                ...getCommonPinningStyles(header.column),
                minWidth: header.getSize() === 150 ? "auto" : header.getSize(),
                width: header.getSize() === 150 ? "auto" : header.getSize(),
              }}
            >
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
            </TableHead>
          ))}
        </TableRow>
      ))}
    </TableHeader>
  );
}
