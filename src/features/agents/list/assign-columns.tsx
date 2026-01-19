import type { BaseColumnOptions } from '@/types/data-table-type';
import { Chip } from '@/components/ui';
import { LabelCell, LevelCell } from '@/features/shared/components/cells';

export const assignColumns: BaseColumnOptions<any>[] = [
	{
		title: 'Cấp bậc cũ',
		key: 'old_agent_level_code',
		render: (row) => (
			<LevelCell
				data={row}
				levelIdKey={'id_old_agent_level'}
				levelCodeKey={'old_agent_level_code'}
			/>
		),
	},
	{
		title: 'Cấp bậc bổ nhiệm',
		key: 'new_agent_level_code',
		render: (row) => (
			<LevelCell
				data={row}
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
