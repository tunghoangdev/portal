import type { BaseColumnOptions } from '~/types/data-table-type';
import { UserCell } from '~/features/shared/components/cells';

export const listColumns: BaseColumnOptions<any>[] = [
	{
		title: 'Thành viên',
		key: 'agent_name',
		render: (row) => (
			<UserCell
				data={row}
				nameKey="agent_name"
				phoneKey="agent_phone"
				avatarKey="agent_avatar"
				showLevel
			/>
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
		title: 'Tổng thành viên',
		key: 'child_all',
	},
];
