import type { BaseColumnOptions } from '~/types/data-table-type';
import { UserCell, LabelCell } from '~/features/shared/components/cells';
export const listColumns: BaseColumnOptions<any>[] = [
	{
		title: 'Nhân viên',
		key: 'staff_name',
		width: 250,
		render: (row) => (
			<UserCell
				data={row}
				// hideAvatar
				nameKey="staff_name"
				levelCodeKey="code"
				avatarKey="staff_avatar"
			/>
		),
	},
	{
		title: 'Nhóm quyền',
		key: 'permission_name',
		width: 170,
	},
	{
		title: 'Trạng thái',
		key: 'is_lock',
		render: (row) => (
			<LabelCell
				active={!row.is_lock}
				activeLabel="Đang mở"
				inactiveLabel="Đã khóa"
			/>
		),
	},
	{
		title: 'Số điện thoại',
		key: 'phone',
		width: 170,
	},
	{
		title: 'Giới tính',
		key: 'gender',
		width: 100,
	},
	{
		title: 'Email',
		key: 'email',
		width: 200,
	},
	{
		title: 'Ngày sinh',
		key: 'birthday',
		type: 'date',
		width: 120,
	},
	{
		title: 'Địa chỉ',
		key: 'address',
		// render: (row) => {
		//   return <div className="md:min-w-[400px]">{row.address}</div>;
		// },
		width: 400,
	},
	{
		title: 'Số CCCD',
		key: 'id_number',
	},
	{
		title: 'Ngày cấp',
		key: 'issued_date',
		type: 'date',
		width: 120,
	},
	{
		title: 'Nơi cấp',
		key: 'issued_place',
		width: 220,
	},
	{
		title: 'Ngân hàng',
		key: 'bank_name',
		width: 350,
	},
	{
		title: 'Số tài khoản',
		key: 'bank_number',
		width: 180,
	},
];
