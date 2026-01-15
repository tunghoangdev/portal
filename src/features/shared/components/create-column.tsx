import type { ColumnDef } from "@tanstack/react-table";
import { cn } from "@heroui/react";
import { formatCurrency, formatDate, formatNumber } from "~/utils/formater";
import type { BaseColumnOptions } from "~/types/data-table-type";

export function createColumn<T>(options: BaseColumnOptions<T>): ColumnDef<T> {
  const {
    title,
    key,
    type = "text",
    sortable = true,
    hidden = false,
    align = "left",
    className = "",
    width,
    minWidth,
    maxWidth,
    render,
    summary,
    actions,
    exportable,
    exportTitle,
    customActions,
  } = options;

  const accessorKey = key as string;

  // if (hidden) return null as any;

  const cell = ({ row }: { row: any }) => {
    if (hidden) return null as any;
    const value = row.original[key];

    if (render) return render(row.original);

    const baseClass = cn(
      // "whitespace-nowrap",
      {
        "text-left justify-start": align === "left",
        "text-center justify-center": align === "center",
        "text-right justify-end": align === "right",
      },
      className
    );

    switch (type) {
      case "currency":
        return <div className={baseClass}>{formatCurrency(value)}</div>;
      case "date":
        return (
          <div className={`${baseClass} text-xs text-content2`}>
            {value ? formatDate(value) : ""}
          </div>
        );
      case "total":
        return <div className={baseClass}>{formatNumber(value)}</div>;
      case "number":
        return <div className={baseClass}>{formatNumber(value)}</div>;
      default:
        return <div className={baseClass}>{value}</div>;
    }
  };

  return {
    header: title,
    accessorKey,
    cell,
    enableSorting: sortable,
    size: typeof width === "number" ? width : undefined,
    minSize: typeof minWidth === "number" ? minWidth : undefined,
    maxSize: typeof maxWidth === "number" ? maxWidth : undefined,
    meta: {
      align,
      key,
      summary,
      type,
      actions,
      exportable,
      exportTitle,
      customActions,
    },
  } as ColumnDef<T>;
}

export const createColumnDef =
  (prefix: string, titlePrefix: string) => (item: any) => ({
    title: `${titlePrefix} ${item.level_code}%`,
    key: `${prefix}${item.id}`,
    type: "number",
    summary: "sum",
  });
