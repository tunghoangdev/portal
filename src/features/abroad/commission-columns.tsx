import { UserCell } from "~/features/shared/components/cells";
import type { BaseColumnOptions } from "~/types/data-table-type";
export const baseCommissionColumns: BaseColumnOptions<any>[] = [
  {
    title: "Thành viên",
    key: "agent_name",
    render: (row) => (
      <UserCell
        data={row}
        showLevel
        levelIdKey="id_agent_level"
        levelCodeKey="agent_level_code"
      />
    ),
    width: 250,
  },
  {
    title: "Cấp bậc",
    exportTitle: "Cấp bậc",
    key: "agent_level_code",
    exportable: true,
  },
  {
    title: "SĐT thành viên",
    exportTitle: "SĐT thành viên",
    key: "agent_phone",
    exportable: true,
  },
  {
    title: "Sản phẩm",
    key: "abroad_product_name",
    width: 200,
  },
  {
    title: "Tổng doanh số",
    key: "fee",
    type: "number",
    // summary: 'sum',
  },
  {
    title: "Phần trăm (%)",
    key: "percentage",
    type: "number",
    summary: "sum",
  },
  {
    title: "Thành tiền",
    key: "amount",
    type: "number",
    summary: "sum",
  },
  // {
  // 	title: 'Thuế TNCN',
  // 	key: 'tax',
  // 	type: 'number',
  // 	summary: 'sum',
  // },
  // {
  // 	title: 'Tổng tiền sau thuế',
  // 	key: 'total',
  // 	type: 'number',
  // 	summary: 'sum',
  // },
  {
    title: "Loại thưởng",
    key: "commission_type",
  },
];
