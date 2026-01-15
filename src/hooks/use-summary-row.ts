import type { SummaryType } from "~/types/data-table-type";
import type { ColumnDef, Row } from "@tanstack/react-table";
interface ColumnMeta<T> {
  key: keyof T;
  type?: "currency" | "text";
  summary?: SummaryType;
}
export function useSummaryRow<T>(rows: Row<T>[], columns: ColumnDef<T, any>[]) {
  const summaryRow: Partial<Record<keyof T, any>> = {};
  let hasSummaryRow = false;

  for (const col of columns) {
    const meta = col.meta as ColumnMeta<T> | undefined;
    if (!meta?.summary) continue;

    hasSummaryRow = true;
    const key = meta.key;

    const values = rows?.map((r) => r.original?.[key]) || [];

    switch (meta.summary) {
      case "sum":
        summaryRow[key] = values.reduce(
          (acc, val) => acc + (Number(val) || 0),
          0
        );
        break;
      case "avg":
        summaryRow[key] =
          values.reduce((acc, val) => acc + (Number(val) || 0), 0) /
          (values.length || 1);
        break;
      case "count":
        summaryRow[key] = values.filter((v) => v != null).length;
        break;
      default:
        summaryRow[key] = "";
    }
  }

  return { summaryRow, hasSummaryRow };
}
