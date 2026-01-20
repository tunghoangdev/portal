import type { BaseColumnOptions } from "@/types/data-table-type";
import { LabelCell } from "@/features/shared/components/cells";

export const commissionPeriodColumns: BaseColumnOptions<any>[] = [
  { title: "Kỳ tính thưởng", key: "commission_period_name" },
  {
    title: "Trạng thái khóa",
    key: "is_lock",
    render: (row) => (
      <LabelCell
        active={!row.is_lock}
        activeLabel="Đang mở"
        inactiveLabel="Đã khóa"
      />
    ),
  },
  { title: "Ngày bắt đầu", key: "from_date", type: "date" },
  { title: "Ngày kết thúc", key: "to_date", type: "date" },
];
