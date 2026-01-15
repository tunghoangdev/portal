import type { BaseColumnOptions } from "~/types/data-table-type";
import { UserCell } from "~/features/shared/components/cells";

export const detailColumns: BaseColumnOptions<any>[] = [
  {
    title: "Kỳ tính thưởng",
    key: "period_name",
  },
  {
    title: "Thành viên",
    key: "agent_name",
    render: (row) => (
      <UserCell
        data={row}
        // hideAvatar
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
    title: "Thu nhập trong kỳ",
    key: "period_amount",
    type: "number",
    summary: "sum",
  },
  {
    title: "Tiền đã ký quỹ",
    key: "escrow_amount",
    type: "number",
    summary: "sum",
  },
  {
    title: "Tổng ký quỹ",
    key: "total_escrow_amount",
    type: "number",
    summary: "sum",
  },
  {
    title: "Diễn giải",
    key: "description",
  },
];
