import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ColumnDef } from "@tanstack/react-table";

export function exportTableToPdf<T>(
  columns: ColumnDef<T>[],
  data: T[],
  fileName = "table-export.pdf"
) {
  const doc = new jsPDF();
  const headers = columns.map((col) =>
    typeof col.header === "string" ? col.header : ""
  );

  const rows = data.map((row: any) =>
    columns.map((col) => {
      const accessor = (col as any).accessorKey;
      if (accessor && row[accessor] !== undefined) {
        return String(row[accessor]);
      }
      return "";
    })
  );

  autoTable(doc, {
    head: [headers],
    body: rows,
  });

  doc.save(fileName);
}
