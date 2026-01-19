import type { BaseColumnOptions } from '@/types/data-table-type';
import { Chip } from '@/components/ui';
import { LabelCell, UserCell } from '@/features/shared/components/cells';

export const changeManagerColumns: BaseColumnOptions<any>[] = [
	{
		title: 'Người giới thiệu cũ',
		key: 'old_agent_name',
		render: (row) => (
			<UserCell
				data={row}
				nameKey={'old_agent_name'}
				phoneKey={'old_agent_phone'}
				avatarKey={'old_agent_avatar'}
				levelIdKey={'id_old_agent_level'}
				levelCodeKey={'old_agent_level_code'}
			/>
		),
	},
	{
		title: 'Người giới thiệu mới',
		key: 'new_agent_name',
		render: (row) => (
			<UserCell
				data={row}
				nameKey={'new_agent_name'}
				phoneKey={'new_agent_phone'}
				avatarKey={'new_agent_avatar'}
				levelIdKey={'id_new_agent_level'}
				levelCodeKey={'new_agent_level_code'}
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
	{ title: 'Người tạo', key: 'created_staff', width: 150 },
	{ title: 'Người duyệt', key: 'admin_name', width: 150 },
	{
		title: 'Ngày khởi tạo',
		key: 'created_date',
		type: 'date',
	},
];
