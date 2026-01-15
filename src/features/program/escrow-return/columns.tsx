import { UserCell } from "~/features/shared/components/cells";
import type { BaseColumnOptions } from "~/types/data-table-type";

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
  {
    title: "Số chứng từ",
    key: "receipt_no",
    width: 160,
  },
  {
    title: "Kỳ tính thưởng",
    key: "period_name",
  },

  {
    title: "Số tiền",
    key: "amount",
    type: "number",
    summary: "sum",
    // render: (row) => formatNumber(row.amount),
  },
  {
    title: "Ngày khởi tạo",
    key: "created_date",
    type: "date",
  },
  {
    title: "Loại",
    key: "type_name",
    width: 200,
  },
];
