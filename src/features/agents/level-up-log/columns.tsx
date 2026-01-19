import { LevelCell, UserCell } from '@/features/shared/components/cells';
import type { BaseColumnOptions } from '@/types/data-table-type';

export const levelUpLogBaseColumns: BaseColumnOptions<any>[] = [
	{
		title: 'Thành viên',
		key: 'agent_name',
		render: (row) => (
			<UserCell data={row} showLevel levelIdKey="id_agent_level" />
		),
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
		title: 'Cấp bậc cũ',
		key: 'old_agent_level_code',
		align: 'center',
		render: (row) => <LevelCell
					data={row}
					levelCodeKey="old_agent_level_code"
					levelIdKey="id_old_agent_level"
				/>,
		width: 140,
	},
	{
		title: 'Cấp bậc thăng tiến',
		key: 'new_agent_level_code',
		align: 'center',
		render: (row) => <LevelCell
					data={row}
					levelCodeKey="new_agent_level_code"
					levelIdKey="id_new_agent_level"
				/>,
		width: 140,
	},
	{
		title: 'Ngày thăng tiến',
		key: 'created_date',
		type: 'date',
		width: 150,
	},
	{
		title: 'Người tạo',
		key: 'created_staff',
	},
];
