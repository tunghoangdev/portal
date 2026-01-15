import { useMemo } from 'react';

interface RevoColumn {
  prop: string;
  meta?: any;
  name?: string;
}

export function useRevoSummaryRow<T extends Record<string, any>>(
  data: T[] = [],
  columns: RevoColumn[] = [],
  label = 'Tổng cộng'
) {
  return useMemo(() => {
    const summaryRow: Record<string, any> = {};
    let hasSummaryRow = false;

    // init tất cả cột rỗng
    for (const col of columns) {
      summaryRow[col.prop] = '';
    }

    // xử lý các cột có meta.summary
    for (const col of columns) {
      const meta = col.meta;
      if (!meta?.summary) continue;
      const key = meta.key ?? col.prop;

      hasSummaryRow = true;
      const values = data.map((r) => r?.[key]).filter((v) => v != null);
      switch (meta.summary) {
        case 'sum':
          summaryRow[key] = values.reduce(
            (acc, v) => acc + (Number(v) || 0),
            0
          );
          break;
        case 'avg':
          summaryRow[key] =
            values.reduce((a, b) => a + (Number(b) || 0), 0) /
            (values.length || 1);
          break;
        case 'count':
          summaryRow[key] = values.length;
          break;
      }
    }
    // Label ở cột đầu tiên (hoặc cột đầu không có summary)
    // const labelCol =
    //   columns.find((col) => !col.meta?.summary)?.prop || columns[0]?.prop;
    // if (labelCol) summaryRow[labelCol] = label;

    const labelCol = columns.find((col: any) => col.lastPinStart);

    if (labelCol) summaryRow[labelCol.prop] = label;
    return { summaryRow, hasSummaryRow };
  }, [data, columns, label]);
}
