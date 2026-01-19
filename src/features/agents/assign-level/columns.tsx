import type { BaseColumnOptions } from '@/types/data-table-type';
import {
	LabelCell,
	LevelCell,
	UserCell,
} from '@/features/shared/components/cells';

export const assignLevelColumns: BaseColumnOptions<any>[] = [
	{
		title: 'Thành viên',
		key: 'agent_name',
		render: (row) => <UserCell data={row} />,
		width: 250,
	},
	{
		title: 'SĐT thành viên',
		exportTitle: 'SĐT thành viên',
		key: 'agent_phone',
		exportable: true,
	},
	{
		title: 'Cấp bậc cũ',
		key: 'old_agent_level_code',
		render: (row) => (
			<LevelCell
				data={row}
				levelIdKey="id_old_agent_level"
				levelCodeKey="old_agent_level_code"
			/>
		),
	},
	{
		title: 'Cấp bậc bổ nhiệm',
		key: 'new_agent_level_code',
		render: (row) => (
			<LevelCell
				data={row}
				levelIdKey="id_new_agent_level"
				levelCodeKey="new_agent_level_code"
			/>
		),
	},
	{
		title: 'Trạng thái',
		key: 'is_approved',
		render: (row) => (
			<LabelCell
				active={row.is_approved}
				activeLabel="Đã duyệt"
				inactiveLabel="Chưa duyệt"
			/>
		),
	},
	{
		title: 'Người tạo',
		key: 'created_staff',
		width: 180,
	},
	{
		title: 'Người duyệt',
		key: 'admin_name',
		width: 180,
	},
	{
		title: 'Ngày khởi tạo',
		key: 'created_date',
		type: 'date',
	},
];
