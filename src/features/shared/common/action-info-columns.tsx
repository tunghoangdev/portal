import type { BaseColumnOptions } from "~/types/data-table-type";
import { formatDateTimeVN } from "~/utils/formater";
import {
  HistoryActionCell,
  UserCell,
} from "~/features/shared/components/cells";

export const actionInfoColumns: BaseColumnOptions<any>[] = [
  {
    title: "Người thao tác",
    key: "action_staff",
    render: (row: any) => (
      <UserCell
        data={row}
        nameKey="action_staff"
        phoneKey="action_code"
        avatarKey="action_avatar"
        levelIdKey="action_level"
      />
    ),
    width: 200,
    // exportable: true,
  },
  {
    title: "Mã người thao tác",
    key: "action_code",
    exportable: true,
    exportTitle: "Mã người thao tác",
  },
  {
    title: "Ngày thao tác",
    key: "action_date",
    type: "datetime",
    width: 120,
    align: "center",
    // exportable: true,
    // render: (row: any) => (
    //   <span className="text-secondary text-xs font-medium flex items-center justify-center">
    //     {formatDateTimeVN(row.action_date, "dd/MM/yyyy HH:mm")}
    //   </span>
    // ),
    render: (row: any) => formatDateTimeVN(row.action_date, "dd/MM/yyyy HH:mm"),
  },
  {
    title: "Thao tác",
    key: "action_name",
    // exportable: true,
    render: (row: any) => <HistoryActionCell name={row.action_name} />,
    align: "center",
    width: 200,
  },
];
