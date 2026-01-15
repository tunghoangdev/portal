import type { BaseColumnOptions } from '~/types/data-table-type';
import {
	HotCell,
	StatusCell,
	UserCell,
} from '~/features/shared/components/cells';

export const AbroadBaseColumns: BaseColumnOptions<any>[] = [
	{
		title: 'Thành viên',
		key: 'agent_name',
		render: (row) => <UserCell data={row} showLevel />,
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
		title: 'Trạng thái',
		key: 'abroad_status_name',
		render: (row) => (
			<StatusCell
				id={row.id_abroad_status}
				name={row.abroad_status_name}
				isNoneLife
			/>
		),
		width: 150,
	},
	{
		title: 'Số hợp đồng',
		key: 'number_contract',
		width: 150,
	},
	{
		title: 'Sản phẩm',
		key: 'product_name',
		render: (row) => <HotCell value={row.product_name} isHot={row.is_main} />,
		width: 250,
	},
	{
		title: 'Tổng doanh số',
		key: 'total_fee',
		type: 'number',
		summary: 'sum',
	},
	{
		title: 'Tổng điểm tích lũy',
		key: 'total_xp',
		type: 'number',
		summary: 'sum',
	},
	{
		title: 'Nhà cung cấp',
		key: 'abroad_provider_name',
		width: 200,
	},
	{
		title: 'Kỳ tính thưởng',
		key: 'period_name',
	},

	{
		title: 'Ngày tạo',
		key: 'created_date',
		type: 'date',
	},
	{
		title: 'Khách hàng',
		key: 'customer_name',
		render: (row) => (
			<UserCell
				data={row}
				nameKey="customer_name"
				phoneKey="customer_phone"
				hideAvatar
			/>
		),
		width: 250,
		hiddenExport: true,
	},
	{
		title: 'Tên khách hàng',
		key: 'customer_name',
		exportable: true,
		exportTitle: 'Tên khách hàng',
	},
	{
		title: 'Tên khách hàng',
		key: 'customer_phone',
		exportable: true,
		exportTitle: 'SĐT khách hàng',
	},
];
