import type { BaseColumnOptions } from "~/types/data-table-type";
import { HotCell } from "~/features/shared/components/cells";

export const columnsDetail: BaseColumnOptions<any>[] = [
  {
    title: "Sản phẩm",
    key: "abroad_product_name",
    render: (row: any) => (
      <HotCell value={row.abroad_product_name} isHot={row.is_main} />
    ),
    width: 300,
  },
  {
    title: "Tổng doanh số",
    key: "fee",
    type: "number",
    summary: "sum",
  },
  {
    title: "Hệ số điểm",
    key: "xp_index",
  },
  {
    title: "Tổng điểm tích lũy",
    key: "xp",
    type: "number",
    summary: "sum",
  },
];
