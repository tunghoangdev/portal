import type { BaseColumnOptions } from "~/types/data-table-type";
import { UserCell } from "~/features/shared/components/cells";

export const listColumns: BaseColumnOptions<any>[] = [
  {
    title: "Thành viên",
    key: "agent_name",
    render: (row) => (
      <UserCell
        data={row}
        nameKey="agent_name"
        phoneKey="agent_phone"
        avatarKey="agent_avatar"
      />
    ),
    width: 250,
  },
  {
    title: "SĐT thành viên",
    exportTitle: "SĐT thành viên",
    key: "agent_phone",
    exportable: true,
  },
  // {
  // 	title: 'Kỳ tính thưởng',
  // 	key: 'period_name',
  // 	width: 130,
  // },
  {
    title: "Tổng tiền trước thuế",
    key: "amount",
    type: "number",
    summary: "sum",
  },
  {
    title: "Thuế TNCN",
    key: "tax",
    type: "number",
    summary: "sum",
  },
  {
    title: "Tổng tiền sau thuế",
    key: "total",
    type: "number",
    summary: "sum",
  },
];
