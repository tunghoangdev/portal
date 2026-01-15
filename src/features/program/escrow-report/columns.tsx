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
        showLevel
      />
    ),
    width: 200,
  },
  {
    title: "SĐT thành viên",
    exportTitle: "SĐT thành viên",
    key: "agent_phone",
    exportable: true,
  },
  {
    title: "Cấp bậc",
    exportTitle: "Cấp bậc",
    key: "agent_level_code",
    exportable: true,
  },
  {
    title: "Tiền đã ký quỹ",
    key: "escrow_amount",
    type: "number",
    summary: "sum",
  },
];
