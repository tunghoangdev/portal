import type { BaseColumnOptions } from '@/types/data-table-type';
import { LevelCell } from '@/features/shared/components/cells';
export const configLevelUpColumns: BaseColumnOptions<any>[] = [
	{
		title: 'Cấp bậc',
		key: 'level_code',
		render: (row) => (
			<LevelCell
				data={row}
				levelCodeKey="level_code"
				levelIdKey="id_agent_level"
			/>
		),
		width: 100,
	},
	{
		title: 'Doanh số cá nhân',
		key: 'xp_person_reach',
		type: 'number',
		width: 250,
	},
	{
		title: 'Doanh số nhóm',
		key: 'xp_group_reach',
		type: 'number',
		width: 250,
	},
	{
		title: 'Thành viên liền kề',
		key: 'no_child_reach',
	},
];
