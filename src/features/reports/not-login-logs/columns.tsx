import type { BaseColumnOptions } from '@/types/data-table-type';
import { UserCell } from '@/features/shared/components/cells';
import { formatDateTimeVN } from '@/utils/formater';

export const staffLoginLogsColumns: BaseColumnOptions<any>[] = [
	{
		title: 'Nhân viên',
		key: 'staff_name',
		render: (row) => (
			<UserCell
				data={row}
				hideAvatar
				nameKey="staff_name"
				phoneKey="staff_code"
				levelCodeKey="code"
				avatarKey="staff_avatar"
			/>
		),
		width: 250,
	},
	{
		title: '',
		exportTitle: 'Mã số nhân viên',
		key: 'staff_code',
		exportable: true,
	},
	{
		title: 'Ngày đăng nhập',
		key: 'login_date',
		type: 'datetime',
		render: (row) => formatDateTimeVN(row.login_date, 'dd/MM/yyyy HH:mm:ss'),
		width: 350,
	},
	{
		title: 'Nguồn đăng nhập',
		key: 'origin',
		width: 350,
	},
	{
		title: 'IP',
		key: 'ip',
	},
];

export const agentLoginLogsColumns: BaseColumnOptions<any>[] = [
	{
		title: 'Thành viên',
		key: 'agent_name',
		render: (row) => (
			<UserCell
				data={row}
				hideAvatar
				nameKey="agent_name"
				phoneKey="agent_phone"
			/>
		),
		width: 250,
	},
	{
		title: 'SĐT thành viên',
		exportTitle: 'SĐT thành viên',
		key: 'agent_phone',
		exportable: true,
	},
	{
		title: 'Ngày đăng nhập',
		key: 'login_date',
		type: 'datetime',
		render: (row) => formatDateTimeVN(row.login_date, 'dd/MM/yyyy HH:mm:ss'),
		width: 350,
	},
	{
		title: 'Nguồn đăng nhập',
		key: 'origin',
		width: 350,
	},
	{
		title: 'IP',
		key: 'ip',
	},
];

const monthCols = Array.from(Array(12).keys()).map((i) => ({
	title: `Tháng ${i + 1}`,
	key: `month_${i + 1}`,
}));

export const agentNotLoginLogsColumns: BaseColumnOptions<any>[] = [
	{
		title: 'Thành viên',
		key: 'agent_name',
		render: (row) => (
			<UserCell
				data={row}
				hideAvatar
				nameKey="agent_name"
				phoneKey="agent_phone"
			/>
		),
		width: 250,
	},
	{
		title: 'SĐT thành viên',
		exportTitle: 'SĐT thành viên',
		key: 'agent_phone',
		exportable: true,
	},
	// {
	// 	title: 'Ngày khởi tạo',
	// 	key: 'created_date',
	// 	type: 'date',
	// },
	// ...monthCols,
	// {
	// 	title: '',
	// 	exportTitle: 'Mã số nhân viên',
	// 	key: 'staff_code',
	// 	hidden: true,
	// 	exportable: true,
	// },
	// {
	// 	title: 'Ngày đăng nhập',
	// 	key: 'login_date',
	// 	render: (row) => formatDateTimeVN(row.login_date, 'dd/MM/yyyy HH:mm:ss'),
	// },
	// {
	// 	title: 'Nguồn đăng nhập',
	// 	key: 'origin',
	// },
	// {
	// 	title: 'IP',
	// 	key: 'ip',
	// },
];
