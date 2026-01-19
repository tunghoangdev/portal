import type { BaseColumnOptions } from '@/types/data-table-type';
import { LabelCell, UserCell } from '@/features/shared/components/cells';

export const changeManagerColumns: BaseColumnOptions<any>[] = [
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
		title: 'Người giới thiệu cũ',
		key: 'old_agent_level_code',
		render: (row) => (
			<UserCell
				data={row}
				nameKey="old_agent_name"
				phoneKey="old_agent_phone"
				avatarKey="old_agent_avatar"
				levelIdKey="id_old_agent_level"
				levelCodeKey="old_agent_level_code"
			/>
		),
	},
	{
		title: 'SĐT Người giới thiệu cũ',
		exportable: true,
		key: 'old_agent_phone',
	},
	{
		title: 'Người giới thiệu mới',
		key: 'new_agent_level_code',
		width: 180,
		render: (row) => (
			<UserCell
				data={row}
				nameKey="new_agent_name"
				phoneKey="new_agent_phone"
				avatarKey="new_agent_avatar"
				levelIdKey="id_new_agent_level"
				levelCodeKey="new_agent_level_code"
			/>
		),
	},
	{
		title: 'SĐT Người giới thiệu mới',
		exportable: true,
		key: 'new_agent_phone',
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
