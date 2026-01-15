import type { BaseColumnOptions } from "~/types/data-table-type";
import { ProductCell } from "~/features/shared/components/cells";

export const DetailColumns: BaseColumnOptions<any>[] = [
  {
    title: "Sản phẩm",
    key: "abroad_product_name",
    render: (row: any) => (
      <ProductCell name={row.abroad_product_name} is_main={row.is_main} />
    ),
    width: 320,
  },
  {
    title: "Nhà cung cấp",
    key: "abroad_provider_name",
    width: 200,
  },
  {
    title: "Số hợp đồng",
    key: "number_contract",
    width: 180,
  },
  {
    title: "Ngày tính thưởng",
    key: "commission_date",
    type: "date",
  },
  {
    title: "Thưởng nhà cung cấp",
    key: "commission_provider",
    type: "number",
    summary: "sum",
    width: 180,
  },
  {
    title: "Thưởng trả thành viên",
    key: "commission_agent",
    type: "number",
    summary: "sum",
    width: 180,
  },
  {
    title: "Lợi nhuận gộp",
    key: "commission_lng",
    type: "number",
    summary: "sum",
  },
];
