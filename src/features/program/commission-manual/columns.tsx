import type { BaseColumnOptions } from '~/types/data-table-type';
import { Icons } from '~/components/icons';
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
		title: 'Số chứng từ',
		key: 'receipt_no',
		width: 160,
	},
	{
		title: 'Kỳ tính thưởng',
		key: 'period_name',
	},

	{
		title: 'Số tiền',
		key: 'amount',
		type: 'number',
		summary: 'sum',
	},
	{
		title: 'Loại thưởng',
		key: 'commission_type_name',
		width: 200,
	},
	{
		title: 'Ngày khởi tạo',
		key: 'created_date',
		type: 'date',
	},
	// {
	// 	title: 'Hệ thống',
	// 	key: 'is_system',
	// 	render: (row) =>
	// 		row.is_system ? (
	// 			<div className="w-full flex justify-center">
	// 				<Icons.check className="text-success" size={14} />
	// 			</div>
	// 		) : null,
	// },
];
