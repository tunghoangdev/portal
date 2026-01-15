import type { BaseColumnOptions } from '~/types/data-table-type';
import { LabelCell } from '~/features/shared/components/cells';
export const listColumns: BaseColumnOptions<any>[] = [
	// {
	// 	title: 'Nhân viên',
	// 	key: 'staff_name',
	// 	width: 250,
	// 	render: (row) => (
	// 		<UserCell
	// 			data={row}
	// 			// hideAvatar
	// 			nameKey="staff_name"
	// 			levelCodeKey="code"
	// 			avatarKey="staff_avatar"
	// 		/>
	// 	),
	// },
	{
		title: 'Mã công ty',
		key: 'key_code',
	},
	{
		title: 'Tên công ty',
		key: 'company_name',
		width: 170,
	},
	{
		title: 'Người đại diện',
		key: 'customer_name',
		width: 170,
	},
	{
		title: 'Số điện thoại',
		key: 'customer_phone',
		width: 170,
	},
	{
		title: 'Email',
		key: 'customer_email',
		width: 200,
	},
	{
		title: 'Trạng thái',
		key: 'is_lock',
		width: 120,
		render: (row) => (
			<LabelCell
				active={!row.is_lock}
				activeLabel="Đang mở"
				inactiveLabel="Đã khóa"
			/>
		),
	},
	{
		title: 'Ngày khởi tạo',
		key: 'created_date',
		width: 180,
		type: 'date',
	},
];
