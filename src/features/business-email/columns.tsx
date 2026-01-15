import type { BaseColumnOptions } from '~/types/data-table-type';
import { LabelCell, UserCell } from '../shared/components/cells';

export const listColumns: BaseColumnOptions<any>[] = [
	{
		title: 'Thành viên',
		key: 'agent_name',
		width: 250,
		render: (row) => <UserCell data={row} showLevel />,
	},
	{
		title: 'Loại mail',
		key: 'is_staff',
		render: (row) => (
			<LabelCell
				active={row.is_staff}
				activeLabel="Nhân viên"
				inactiveLabel="Thành viên"
				inactiveColor="secondary"
			/>
		),
	},
	{
		title: 'Cấp bậc',
		exportTitle: 'Cấp bậc',
		key: 'agent_level_code',
		exportable: true,
	},
	{
		title: 'Email',
		key: 'mail',
		width: 250,
	},
	{
		title: 'Mật khẩu',
		key: 'password',
	},
	{
		title: 'Dung lượng',
		key: 'storage',
		width: 180,
	},

	{
		title: 'Trạng thái',
		key: 'is_lock',
		render: (row) => (
			<LabelCell
				active={!row.is_lock}
				activeLabel="Đang hoạt động"
				inactiveLabel="Ngừng hoạt động"
			/>
		),
	},
	{
		title: 'Ngày tạo',
		key: 'created_date',
		type: 'date',
		width: 180,
	},
];
