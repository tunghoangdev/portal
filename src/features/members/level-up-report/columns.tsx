import type { BaseColumnOptions } from '@/types/data-table-type';
import { LabelCell, UserCell } from '@/features/shared/components/cells';

export const levelUpReportBaseColumns: BaseColumnOptions<any>[] = [
  {
    title: 'Thành viên',
    key: 'agent_name',
    render: (row) => <UserCell data={row} showLevel />,
    width: 250,
  },
  {
    title: 'Cấp bậc',
    exportTitle: 'Cấp bậc',
    key: 'agent_level_code',
    exportable: true,
  },
  {
    title: 'SĐT thành viên',
    exportTitle: 'SĐT thành viên',
    key: 'agent_phone',
    exportable: true,
  },
  {
    title: 'Trạng thái',
    key: 'is_pass',
    render: (row) => (
      <LabelCell
        active={row?.is_pass}
        activeLabel="Đã đủ điều kiện"
        inactiveLabel="Chưa đủ điều kiện"
      />
    ),
    width: 160,
  },
  {
    title: 'Điểm tích lũy cá nhân hiện tại',
    key: 'xp_person',
    type: 'number',
    width: 250,
    // summary: 'sum',
  },
  {
    title: 'Điểm tích lũy cá nhân cần đạt',
    key: 'xp_person_reach',
    type: 'number',
    width: 250,
    // summary: 'sum',
  },
  {
    title: 'Điểm tích lũy cá nhân còn thiếu',
    key: 'xp_person_remain',
    type: 'number',
    width: 250,
    // summary: 'sum',
  },
  {
    title: 'Điểm tích lũy nhóm hiện tại',
    key: 'xp_group',
    type: 'number',
    width: 250,
    // summary: 'sum',
  },
  {
    title: 'Điểm tích lũy nhóm cần đạt',
    key: 'xp_group_reach',
    type: 'number',
    width: 250,
    // summary: 'sum',
  },
  {
    title: 'Điểm tích lũy nhóm còn thiếu',
    key: 'xp_group_remain',
    type: 'number',
    width: 250,
    // summary: 'sum',
  },
  {
    title: 'Tuyến dưới hiện tại',
    key: 'no_child',
    width: 180,
  },
  {
    title: 'Tuyến dưới cần đạt',
    key: 'no_child_reach',
    width: 180,
  },
  {
    title: 'Tuyến dưới còn thiếu',
    key: 'no_child_remain',
    width: 180,
  },
  {
    title: 'Ngày cập nhật',
    key: 'updated_date',
    type: 'date',
  },
];
