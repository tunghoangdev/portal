import type { BaseColumnOptions } from "@/types/data-table-type";
import { UserCell } from "@/features/shared/components/cells";

export const commissionBaseColumns: BaseColumnOptions<any>[] = [
  {
    title: "Thành viên",
    key: "agent_name",
    render: (row) => <UserCell data={row} />,
    width: 250,
  },
  {
    title: "SĐT thành viên",
    exportTitle: "SĐT thành viên",
    key: "agent_phone",
    exportable: true,
  },
  {
    title: "Sản phẩm",
    key: "life_product_name",
  },
  {
    title: "Tổng doanh số",
    key: "xfyp",
    type: "number",
    summary: "sum",
  },
  {
    title: "Phần trăm (%)",
    key: "percentage",
  },
  {
    title: "Thành tiền",
    key: "amount",
    type: "number",
    summary: "sum",
  },
  // {
  //   title: "Thuế TNCN",
  //   key: "tax",
  //   type: "number",
  //   summary: "sum",
  // },
  // {
  //   title: "Tổng tiền sau thuế",
  //   key: "total",
  //   type: "number",
  //   summary: "sum",
  // },
  {
    title: "Loại thưởng",
    key: "commission_type",
  },
];
